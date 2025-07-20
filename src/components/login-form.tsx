"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // In a real app, you would call your auth service here.
    // We'll simulate a successful login.
    setTimeout(() => {
        toast({
            title: "Login Successful",
            description: "Welcome back!",
        });
        router.push('/my-applications');
        setIsSubmitting(false);
    }, 1000);
  }

  return (
    <Card className="w-full shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Login
                </Button>
                <p className="text-xs text-muted-foreground">
                    Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
                </p>
            </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
