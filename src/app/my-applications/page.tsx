import SiteHeader from "@/components/site-header";
import { Applicant } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicantsTable from "@/components/applicants-table";
import { Ticket } from "lucide-react";

// In a real app, you'd fetch this based on the logged-in user
const mockUserApplications: Applicant[] = [
    { id: "APP-001", name: "Alice Johnson", email: "alice@example.com", submissionDate: "2024-05-20", paymentStatus: "Paid", status: "Winner" },
    { id: "APP-008", name: "Alice Johnson", email: "alice@example.com", submissionDate: "2024-04-15", paymentStatus: "Paid", status: "Not a Winner" },
];

export default function MyApplicationsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Ticket className="h-10 w-10 text-primary" />
                <div>
                    <h1 className="text-4xl font-bold font-headline">My Applications</h1>
                    <p className="text-muted-foreground">A history of all your lottery entries.</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Entries</CardTitle>
                    <CardDescription>Here are all the applications you have submitted.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ApplicantsTable applicants={mockUserApplications} />
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
