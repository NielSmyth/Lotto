import LoginForm from "@/components/login-form";
import SiteHeader from "@/components/site-header";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-24">
        <div className="container">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <LogIn className="mx-auto h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold mt-4 font-headline">Login</h1>
              <p className="text-muted-foreground mt-2">Access your LottoLink account.</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
