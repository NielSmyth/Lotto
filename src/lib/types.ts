export type UserRole = 'USER' | 'ADMIN';

export type Applicant = {
  id: string;
  name: string;
  email: string;
  submissionDate: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  status: 'Received' | 'Processing' | 'Winner' | 'Not a Winner';
  userId?: number;
};

export type User = {
    id: number;
    fullName: string;
    email: string;
    passwordHash: string;
    role: UserRole;
}

export type SessionPayload = {
  userId: number;
  role: UserRole;
  expires: Date;
}

export type DashboardStats = {
  totalApplicants: number;
  totalWinners: number;
  processingApplicants: number;
}

export type ApplicationsPerDay = {
  date: string;
  count: number;
}
