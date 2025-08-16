"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useActionState } from "react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, CreditCard, User, Loader2 } from "lucide-react";
import { submitApplicationAction } from "@/app/apply/actions";
import { useToast } from "@/hooks/use-toast";

const personalInfoSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
});

const paymentSchema = z.object({
  cardName: z.string().min(2, { message: "Name on card is required." }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Card number must be 16 digits." }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Expiry date must be in MM/YY format." }),
  cvc: z.string().regex(/^\d{3,4}$/, { message: "CVC must be 3 or 4 digits." }),
});

const formSchema = personalInfoSchema.merge(paymentSchema);

export default function ApplyForm() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [state, formAction, isPending] = useActionState(submitApplicationAction, { success: false });
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  useEffect(() => {
    if (state.success) {
        form.reset();
        setActiveTab("personal");
    }
    if (state.error) {
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: "Failed to submit application. Please try again.",
        });
    }
  }, [state, form, toast]);


  async function handleNext() {
    const isValid = await form.trigger(["fullName", "email", "phone"]);
    if (isValid) {
      setActiveTab("payment");
    }
  }

  if (state.success && state.applicationId) {
    return (
      <Alert variant="default" className="bg-accent/10 border-accent text-accent-foreground">
        <CheckCircle className="h-4 w-4 !text-accent" />
        <AlertTitle className="font-headline">Application Submitted!</AlertTitle>
        <AlertDescription>
          Your lottery application has been successfully submitted. Your Application ID is{" "}
          <strong className="font-mono">{state.applicationId}</strong>. Please save this for your records.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <Form {...form}>
        <form action={formAction}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">
                  <User className="mr-2 h-4 w-4" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="personal">
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="button" onClick={handleNext} className="ml-auto">
                  Next
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="payment">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Enter your payment information to complete the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name on Card</FormLabel>
                      <FormControl>
                        <Input placeholder="John M Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="**** **** **** ****" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cvc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("personal")}>
                  Back
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit Application
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </Card>
  );
}
