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
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Loader2, XCircle } from "lucide-react";

const formSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required."),
});

type Status = "Received" | "Processing" | "Winner" | "Not a Winner" | "Invalid";

interface StatusResult {
  status: Status;
  id: string;
  date: string;
}

const mockData: { [key: string]: StatusResult } = {
  "LOTTO-123456": {
    status: "Winner",
    id: "LOTTO-123456",
    date: "2023-10-26",
  },
  "LOTTO-789012": {
    status: "Processing",
    id: "LOTTO-789012",
    date: "2023-10-25",
  },
  "LOTTO-345678": {
    status: "Not a Winner",
    id: "LOTTO-345678",
    date: "2023-10-26",
  },
};

const StatusInfo = ({ result }: { result: StatusResult }) => {
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
          Result as of: {new Date(result.date).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default function StatusForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusResult, setStatusResult] = useState<StatusResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { applicationId: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setStatusResult(null);
    setTimeout(() => {
      const id = values.applicationId.toUpperCase();
      const result = mockData[id] || { status: "Invalid", id: values.applicationId, date: new Date().toISOString() };
      setStatusResult(result);
      setIsLoading(false);
    }, 1500);
  }

  return (
    <>
      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="applicationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., LOTTO-123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check Status
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      {statusResult && <StatusInfo result={statusResult} />}
    </>
  );
}
