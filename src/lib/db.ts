import Database from 'better-sqlite3';
import type { Applicant, User, UserRole } from './types';

const db = new Database('lottolink.db');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER'
  );

  CREATE TABLE IF NOT EXISTS applicants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    submissionDate TEXT NOT NULL,
    paymentStatus TEXT NOT NULL,
    status TEXT NOT NULL,
    userId INTEGER,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

// Seed an admin user if one doesn't exist
const adminUserExists = db.prepare('SELECT id FROM users WHERE email = ?').get('staff@lottolink.gov');
if (!adminUserExists) {
    const adminId = '1'; // fixed ID for admin
    // In a real app, you'd use a secure password hashing library like bcrypt or argon2
    const passwordHash = 'adminpassword'; // Simple hash for demo purposes
    db.prepare('INSERT OR IGNORE INTO users (id, fullName, email, passwordHash, role) VALUES (?, ?, ?, ?, ?)')
      .run(adminId, 'Post Office Staff', 'staff@lottolink.gov', passwordHash, 'ADMIN');
}


export const dbService = {
  // User methods
  createUser: async (data: Omit<User, 'id' | 'role'> & {passwordHash: string}): Promise<User> => {
    const stmt = db.prepare('INSERT INTO users (fullName, email, passwordHash, role) VALUES (?, ?, ?, ?)');
    const result = stmt.run(data.fullName, data.email, data.passwordHash, 'USER');
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as User;
    return newUser;
  },

  findUserByEmail: async (email: string): Promise<User | undefined> => {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
    return user;
  },

  findUserById: async (id: number): Promise<User | undefined> => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
    return user;
  },

  // Applicant methods
  getApplicants: async (): Promise<Applicant[]> => {
    const applicants = db.prepare('SELECT * FROM applicants ORDER BY submissionDate DESC').all() as Applicant[];
    return applicants;
  },

  getApplicant: async (id: string): Promise<Applicant | undefined> => {
    const applicant = db.prepare('SELECT * FROM applicants WHERE id = ?').get(id.toUpperCase()) as Applicant | undefined;
    return applicant;
  },

  getApplicantsByUserId: async (userId: number): Promise<Applicant[]> => {
    const applicants = db.prepare('SELECT * FROM applicants WHERE userId = ? ORDER BY submissionDate DESC').all(userId) as Applicant[];
    return applicants;
  },

  createApplicant: async (data: {
    fullName: string;
    email: string;
    userId?: number;
  }): Promise<Applicant> => {
    const id = `APP-${String(Math.floor(100000 + Math.random() * 900000))}`;
    const newApplicant: Omit<Applicant, 'userId'> & { userId?: number } = {
      id,
      name: data.fullName,
      email: data.email,
      submissionDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'Paid',
      status: 'Received',
    };
    const stmt = db.prepare('INSERT INTO applicants (id, name, email, submissionDate, paymentStatus, status, userId) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(newApplicant.id, newApplicant.name, newApplicant.email, newApplicant.submissionDate, newApplicant.paymentStatus, newApplicant.status, data.userId);
    return { ...newApplicant, userId: data.userId };
  },

  updateApplicant: async (id: string, data: Partial<Omit<Applicant, 'id'>>): Promise<Applicant | undefined> => {
    const { name, email, status } = data;
    const stmt = db.prepare('UPDATE applicants SET name = ?, email = ?, status = ? WHERE id = ?');
    const result = stmt.run(name, email, status, id);
    if (result.changes > 0) {
        return dbService.getApplicant(id);
    }
    return undefined;
  },

  deleteApplicant: async (id: string): Promise<{ success: boolean }> => {
    const stmt = db.prepare('DELETE FROM applicants WHERE id = ?');
    const result = stmt.run(id);
    return { success: result.changes > 0 };
  }
};
