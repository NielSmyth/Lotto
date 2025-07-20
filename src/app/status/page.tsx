import SiteHeader from "@/components/site-header";
import StatusForm from "@/components/status-form";
import { Search } from "lucide-react";

export default function StatusPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Search className="mx-auto h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold mt-4 font-headline">Check Application Status</h1>
              <p className="text-muted-foreground mt-2">
                Enter your Application ID below to see the current status of your lottery entry.
              </p>
            </div>
            <StatusForm />
          </div>
        </div>
      </main>
    </div>
  );
}
