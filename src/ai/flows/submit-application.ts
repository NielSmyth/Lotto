'use server';
/**
 * @fileOverview A flow for submitting a new lottery application.
 *
 * - submitApplication - Handles the application submission process.
 * - SubmitApplicationInput - The input type for the submitApplication function.
 * - SubmitApplicationOutput - The return type for the submitApplication function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { dbService } from '@/lib/db';
import { getSession } from '@/lib/session';

const SubmitApplicationInputSchema = z.object({
  fullName: z.string().describe('The full name of the applicant.'),
  email: z.string().email().describe('The email address of the applicant.'),
  phone: z.string().describe('The phone number of the applicant.'),
  cardName: z.string().describe('The name on the credit card.'),
  cardNumber: z.string().describe('The credit card number.'),
  expiryDate: z.string().describe('The credit card expiry date.'),
  cvc: z.string().describe('The credit card CVC.'),
});
export type SubmitApplicationInput = z.infer<typeof SubmitApplicationInputSchema>;

const SubmitApplicationOutputSchema = z.object({
  applicationId: z.string().describe('The unique ID of the submitted application.'),
  message: z.string().describe('A confirmation message.'),
});
export type SubmitApplicationOutput = z.infer<typeof SubmitApplicationOutputSchema>;

export async function submitApplication(
  input: SubmitApplicationInput
): Promise<SubmitApplicationOutput> {
  return submitApplicationFlow(input);
}

const submitApplicationFlow = ai.defineFlow(
  {
    name: 'submitApplicationFlow',
    inputSchema: SubmitApplicationInputSchema,
    outputSchema: SubmitApplicationOutputSchema,
  },
  async (input) => {
    // In a real application, you would process the payment here.
    // For this demo, we'll just create the applicant record.
    const session = await getSession();

    const applicant = await dbService.createApplicant({
      fullName: input.fullName,
      email: input.email,
      userId: session?.userId
    });

    return {
      applicationId: applicant.id,
      message: 'Application submitted successfully.',
    };
  }
);
