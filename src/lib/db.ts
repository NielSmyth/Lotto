import type { Applicant } from './types';

// This is a mock in-memory database.
// In a real application, you would use a proper database.

const applicants: Map<string, Applicant> = new Map([
    ["APP-001", { id: "APP-001", name: "Alice Johnson", email: "alice@example.com", submissionDate: "2024-05-20", paymentStatus: "Paid" }],
    ["APP-002", { id: "APP-002", name: "Bob Williams", email: "bob@example.com", submissionDate: "2024-05-20", paymentStatus: "Paid" }],
    ["APP-003", { id: "APP-003", name: "Charlie Brown", email: "charlie@example.com", submissionDate: "2024-05-19", paymentStatus: "Pending" }],
    ["APP-004", { id: "APP-004", name: "Diana Prince", email: "diana@example.com", submissionDate: "2024-05-19", paymentStatus: "Paid" }],
    ["APP-005", { id: "APP-005", name: "Ethan Hunt", email: "ethan@example.com", submissionDate: "2024-05-18", paymentStatus: "Failed" }],
    ["APP-006", { id: "APP-006", name: "Fiona Glenanne", email: "fiona@example.com", submissionDate: "2024-05-18", paymentStatus: "Paid" }],
    ["APP-007", { id: "APP-007", name: "George Costanza", email: "george@example.com", submissionDate: "2024-05-17", paymentStatus: "Paid" }],
]);

export const db = {
  getApplicants: async (): Promise<Applicant[]> => {
    return Array.from(applicants.values());
  },
  getApplicant: async (id: string): Promise<Applicant | undefined> => {
    return applicants.get(id);
  },
  createApplicant: async (data: {
    fullName: string;
    email: string;
  }): Promise<Applicant> => {
    const id = `APP-${String(Math.floor(100000 + Math.random() * 900000)).padStart(6, '0')}`;
    const newApplicant: Applicant = {
      id,
      name: data.fullName,
      email: data.email,
      submissionDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'Paid',
    };
    applicants.set(id, newApplicant);
    return newApplicant;
  },
};
