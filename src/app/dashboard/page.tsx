import ApplicantsTable from "@/components/applicants-table";
import { dbService } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const applicants = await dbService.getApplicants();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Applicant Records</CardTitle>
          <CardDescription>View and manage all lottery applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicantsTable applicants={applicants} isAdmin={true} />
        </CardContent>
      </Card>
    </div>
  );
}
