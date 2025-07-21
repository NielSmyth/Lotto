"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { signup } from "@/lib/auth";
import { Label } from "./ui/label";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";


export default function SignupForm() {
    const [state, formAction] = useActionState(signup, undefined);

  return (
    <Card className="w-full shadow-lg">
        <form action={formAction}>
            <CardHeader>
                <CardTitle>Create Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" placeholder="John Doe" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} />
                 </div>
                  {state?.error && (
                    <Alert variant="destructive">
                        <AlertTitle>Signup Failed</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                 )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
                <p className="text-xs text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
                </p>
            </CardFooter>
        </form>
    </Card>
  );
}
