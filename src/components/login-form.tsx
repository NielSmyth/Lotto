"use client";

import { useFormState } from 'react-dom';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { login } from '@/lib/auth';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';


export default function LoginForm() {
    const [state, formAction] = useFormState(login, undefined);

  return (
    <Card className="w-full shadow-lg">
      <form action={formAction}>
            <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" placeholder="••••••••" required />
                 </div>
                 {state?.error && (
                    <Alert variant="destructive">
                        <AlertTitle>Login Failed</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                 )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <p className="text-xs text-muted-foreground">
                    Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
                </p>
            </CardFooter>
        </form>
    </Card>
  );
}
