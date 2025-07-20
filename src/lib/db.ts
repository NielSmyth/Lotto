import type { Applicant, User } from './types';

// This is a mock in-memory database.
// In a real application, you would use a proper database.

const users: Map<string, User> = new Map([
    ["USER-001", { id: "USER-001", fullName: "Alice Johnson", email: "alice@example.com", passwordHash: "hashed_password" }],
]);

const applicants: Map<string, Applicant> = new Map([
    ["APP-001", { id: "APP-001", name: "Alice Johnson", email: "alice@example.com", submissionDate: "2024-05-20", paymentStatus: "Paid", status: "Winner", userId: "USER-001" }],
    ["APP-002", { id: "APP-002", name: "Bob Williams", email: "bob@example.com", submissionDate: "2024-05-20", paymentStatus: "Paid", status: "Processing" }],
    ["APP-003", { id: "APP-003", name: "Charlie Brown", email: "charlie@example.com", submissionDate: "2024-05-19", paymentStatus: "Pending", status: "Received" }],
    ["APP-004", { id: "APP-004", name: "Diana Prince", email: "diana@example.com", submissionDate: "2024-05-19", paymentStatus: "Paid", status: "Processing" }],
    ["APP-005", { id: "APP-005", name: "Ethan Hunt", email: "ethan@example.com", submissionDate: "2024-05-18", paymentStatus: "Failed", status: "Received" }],
    ["APP-006", { id: "APP-006", name: "Fiona Glenanne", email: "fiona@example.com", submissionDate: "2024-05-18", paymentStatus: "Paid", status: "Not a Winner" }],
    ["APP-007", { id: "APP-007", name: "George Costanza", email: "george@example.com", submissionDate: "2024-05-17", paymentStatus: "Paid", status: "Not a Winner" }],
    ["APP-008", { id: "APP-008", name: "Alice Johnson", email: "alice@example.com", submissionDate: "2024-04-15", paymentStatus: "Paid", status: "Not a Winner", userId: "USER-001" }],
]);

export const db = {
  // User methods
  createUser: async (data: Omit<User, 'id'>): Promise<User> => {
    const id = `USER-${String(users.size + 1).padStart(3, '0')}`;
    const newUser = { id, ...data };
    users.set(id, newUser);
    return newUser;
  },
  findUserByEmail: async (email: string): Promise<User | undefined> => {
    return Array.from(users.values()).find(user => user.email === email);
  },

  // Applicant methods
  getApplicants: async (): Promise<Applicant[]> => {
    return Array.from(applicants.values());
  },
  getApplicant: async (id: string): Promise<Applicant | undefined> => {
    return applicants.get(id.toUpperCase());
  },
  getApplicantsByUserId: async (userId: string): Promise<Applicant[]> => {
    return Array.from(applicants.values()).filter(app => app.userId === userId);
  },
  createApplicant: async (data: {
    fullName: string;
    email: string;
    userId?: string;
  }): Promise<Applicant> => {
    const id = `APP-${String(Math.floor(100000 + Math.random() * 900000))}`;
    const newApplicant: Applicant = {
      id,
      name: data.fullName,
      email: data.email,
      submissionDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'Paid',
      status: 'Received',
      userId: data.userId,
    };
    applicants.set(id, newApplicant);
    return newApplicant;
  },
};
