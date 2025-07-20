export type Applicant = {
  id: string;
  name: string;
  email: string;
  submissionDate: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  status: 'Received' | 'Processing' | 'Winner' | 'Not a Winner';
  userId?: string;
};

export type User = {
    id: string;
    fullName: string;
    email: string;
    passwordHash: string; // In a real app, never store plain text passwords
}
