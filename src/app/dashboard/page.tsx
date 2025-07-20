import ApplicantsTable from "@/components/applicants-table";
import { Applicant } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const mockApplicants: Applicant[] = [
  { id: "APP-001", name: "Alice Johnson", email: "alice@example.com", submissionDate: "2024-05-20", paymentStatus: "Paid" },
  { id: "APP-002", name: "Bob Williams", email: "bob@example.com", submissionDate: "2024-05-20", paymentStatus: "Paid" },
  { id: "APP-003", name: "Charlie Brown", email: "charlie@example.com", submissionDate: "2024-05-19", paymentStatus: "Pending" },
  { id: "APP-004", name: "Diana Prince", email: "diana@example.com", submissionDate: "2024-05-19", paymentStatus: "Paid" },
  { id: "APP-005", name: "Ethan Hunt", email: "ethan@example.com", submissionDate: "2024-05-18", paymentStatus: "Failed" },
  { id: "APP-006", name: "Fiona Glenanne", email: "fiona@example.com", submissionDate: "2024-05-18", paymentStatus: "Paid" },
  { id: "APP-007", name: "George Costanza", email: "george@example.com", submissionDate: "2024-05-17", paymentStatus: "Paid" },
];


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Applicant Records</CardTitle>
          <CardDescription>View and manage all lottery applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicantsTable applicants={mockApplicants} />
        </CardContent>
      </Card>
    </div>
  );
}
