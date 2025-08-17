import ApplicantsTable from "@/components/applicants-table";
import { dbService } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Clock } from "lucide-react";
import ApplicationsChart from "./applications-chart";

export default async function DashboardPage() {
  const applicants = await dbService.getApplicants();
  const stats = await dbService.getDashboardStats();
  const chartData = await dbService.getApplicationsPerDay();
  
  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplicants}</div>
            <p className="text-xs text-muted-foreground">All-time registered applicants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Winners Selected</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWinners}</div>
            <p className="text-xs text-muted-foreground">Total applicants marked as winners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processingApplicants}</div>
            <p className="text-xs text-muted-foreground">Applications with 'Processing' status</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Application Overview</CardTitle>
             <CardDescription>A chart showing the number of applications per day.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ApplicationsChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
           <CardHeader>
            <CardTitle className="font-headline">Recent Applicants</CardTitle>
            <CardDescription>The 5 most recent lottery applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicants.slice(0, 5).map(app => (
                <div key={app.id} className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">{app.name}</p>
                    <p className="text-sm text-muted-foreground">{app.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{app.id}</p>
                    <p className="text-sm text-muted-foreground">{new Date(app.submissionDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
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
