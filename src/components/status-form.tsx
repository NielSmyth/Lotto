"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useActionState } from "react";
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
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import { getApplicationStatusAction } from "@/app/status/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required."),
});

type StatusResult = {
    id: string;
    found: boolean;
    status?: 'Received' | 'Processing' | 'Winner' | 'Not a Winner';
    submissionDate?: string;
}

const StatusInfo = ({ result }: { result: StatusResult }) => {
    if (!result.found) {
        return (
            <Card className="mt-6 animate-in fade-in-50 border-yellow-500 bg-yellow-500/10">
                <CardHeader>
                    <div className="flex items-center gap-4">
                    <AlertCircle className="h-10 w-10 text-yellow-600" />
                    <div>
                        <CardTitle className="font-headline text-yellow-800">Status: Invalid ID</CardTitle>
                        <CardDescription>Application ID: {result.id}</CardDescription>
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                    We could not find an application with this ID. Please check the ID and try again.
                    </p>
                </CardContent>
            </Card>
        )
    }

  const getIcon = () => {
    switch (result.status) {
      case "Winner":
        return <CheckCircle className="h-10 w-10 text-accent" />;
      case "Processing":
        return <Clock className="h-10 w-10 text-blue-500" />;
      case "Not a Winner":
        return <XCircle className="h-10 w-10 text-destructive" />;
      case "Received":
        return <CheckCircle className="h-10 w-10 text-gray-500" />;
      default:
        return <AlertCircle className="h-10 w-10 text-yellow-500" />;
    }
  };

  return (
    <Card className="mt-6 animate-in fade-in-50">
      <CardHeader>
        <div className="flex items-center gap-4">
          {getIcon()}
          <div>
            <CardTitle className="font-headline">Status: {result.status}</CardTitle>
            <CardDescription>Application ID: {result.id}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Result as of: {new Date(result.submissionDate!).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default function StatusForm() {
  const [state, formAction, isPending] = useActionState(getApplicationStatusAction, { success: false });
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { applicationId: "" },
  });

  useEffect(() => {
    if (state.error) {
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: state.error,
        });
    }
  }, [state, toast])

  return (
    <>
      <Card className="shadow-lg">
        <Form {...form}>
          <form action={formAction}>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="applicationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., APP-123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check Status
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      {state.success && state.result && <StatusInfo result={state.result as StatusResult} />}
    </>
  );
}
