import SignupForm from "@/components/signup-form";
import SiteHeader from "@/components/site-header";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-12 md:py-24">
        <div className="container">
          <div className="max-w-md mx-auto">
             <div className="text-center mb-8">
              <UserPlus className="mx-auto h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold mt-4 font-headline">Create an Account</h1>
              <p className="text-muted-foreground mt-2">Join LottoLink to start playing.</p>
            </div>
            <SignupForm />
          </div>
        </div>
      </main>
    </>
  );
}
