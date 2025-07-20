export type Applicant = {
  id: string;
  name: string;
  email: string;
  submissionDate: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
};
