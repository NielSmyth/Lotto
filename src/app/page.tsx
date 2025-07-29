import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Edit, ShieldCheck } from "lucide-react";
import SiteHeader from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-4">
                Your Chance to Win Big
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground font-headline">
                The Future of Lottery is Here
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                LottoLink provides a secure and easy way to participate in the lottery. Apply online, track your status, and get results instantly.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="font-semibold">
                  <Link href="/login">Apply Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-semibold">
                  <Link href="/login">Check Status</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-20 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Why Choose LottoLink?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We've streamlined the lottery process to be simple, secure, and accessible for everyone.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Edit className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Easy Online Application</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Fill out your application form from anywhere, at any time. Our intuitive form makes the process a breeze.</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Secure Submission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Your personal information and payments are protected with state-of-the-art security measures.</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">Instant Status Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Receive digital confirmations and monitor your application status in real-time. No more waiting games.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} LottoLink. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </>
  );
}
