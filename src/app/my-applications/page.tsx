import SiteHeader from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicantsTable from "@/components/applicants-table";
import { Ticket } from "lucide-react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { dbService } from "@/lib/db";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function TableFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full max-w-sm" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(6)].map((_, i) => <TableCell key={i}><Skeleton className="h-5 w-full" /></TableCell>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(6)].map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

async function UserApplications() {
  const session = await getSession();
  if (!session?.userId) {
    redirect('/login');
  }
  const userApplications = await dbService.getApplicantsByUserId(session.userId);
  return <ApplicantsTable applicants={userApplications} />
}


export default async function MyApplicationsPage() {
  return (
    <>
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
                    <Suspense fallback={<TableFallback />}>
                      <UserApplications />
                    </Suspense>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

// Temporary components for skeleton, should be defined in their own file in a real app
const Table = ({ children }: { children: React.ReactNode }) => <div className="w-full">{children}</div>
const TableHeader = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const TableRow = ({ children }: { children: React.ReactNode }) => <div className="flex gap-4 p-2">{children}</div>
const TableCell = ({ children }: { children: React.ReactNode }) => <div className="flex-1">{children}</div>
const TableBody = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
