"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { processLotteryResults } from "@/ai/flows/process-lottery-results";
import type { ProcessLotteryResultsOutput } from "@/ai/flows/process-lottery-results";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, AlertTriangle, CheckCircle, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  lotteryEntriesFile: z
    .any()
    .refine((files) => files?.length === 1, "Lottery entries file is required."),
  relevantRegulations: z.string().min(10, "Regulations must be at least 10 characters long."),
});

export default function AIResultsProcessor() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProcessLotteryResultsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lotteryEntriesFile: undefined,
      relevantRegulations: "",
    },
  });

  const fileRef = form.register("lotteryEntriesFile");

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    try {
      const file = values.lotteryEntriesFile[0];
      const lotteryEntriesDataUri = await readFileAsDataURL(file);

      const aiResult = await processLotteryResults({
        lotteryEntriesDataUri,
        relevantRegulations: values.relevantRegulations,
      });

      setResult(aiResult);
      form.reset();
    } catch (error) {
      console.error("AI processing failed:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to process lottery results. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="lotteryEntriesFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lottery Entries Data</FormLabel>
                <FormControl>
                  <Input type="file" {...fileRef} />
                </FormControl>
                <FormDescription>
                  Upload the file containing all lottery entries (e.g., CSV, TXT).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="relevantRegulations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relevant Regulations</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the lottery rules and regulations here..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
                <>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Process with AI
                </>
            )}
          </Button>
        </form>
      </Form>

      {result && (
        <div className="mt-8 space-y-6 animate-in fade-in-50">
          <Card className="bg-green-500/10 border-green-500">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <CardTitle className="text-green-700">Results Summary</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{result.resultsSummary}</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/10 border-yellow-500">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    <CardTitle className="text-yellow-800">Potential Anomalies</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{result.potentialAnomalies}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
