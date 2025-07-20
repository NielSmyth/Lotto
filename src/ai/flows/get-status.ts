'use server';
/**
 * @fileOverview A flow for getting the status of a lottery application.
 *
 * - getApplicationStatus - Handles retrieving application status.
 * - GetApplicationStatusInput - The input type for the getApplicationStatus function.
 * - GetApplicationStatusOutput - The return type for the getApplicationStatus function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { db } from '@/lib/db';

const GetApplicationStatusInputSchema = z.object({
  applicationId: z.string().describe('The unique ID of the application.'),
});
export type GetApplicationStatusInput = z.infer<typeof GetApplicationStatusInputSchema>;

const GetApplicationStatusOutputSchema = z.object({
  id: z.string().describe('The application ID.'),
  found: z.boolean().describe('Whether the application was found.'),
  status: z.enum(['Received', 'Processing', 'Winner', 'Not a Winner']).optional().describe('The status of the application.'),
  submissionDate: z.string().optional().describe('The date the application was submitted.'),
});
export type GetApplicationStatusOutput = z.infer<typeof GetApplicationStatusOutputSchema>;

export async function getApplicationStatus(
  input: GetApplicationStatusInput
): Promise<GetApplicationStatusOutput> {
  return getApplicationStatusFlow(input);
}

const getApplicationStatusFlow = ai.defineFlow(
  {
    name: 'getApplicationStatusFlow',
    inputSchema: GetApplicationStatusInputSchema,
    outputSchema: GetApplicationStatusOutputSchema,
  },
  async (input) => {
    const applicant = await db.getApplicant(input.applicationId);

    if (!applicant) {
      return {
        id: input.applicationId,
        found: false,
      };
    }

    return {
      id: applicant.id,
      found: true,
      status: applicant.status,
      submissionDate: applicant.submissionDate,
    };
  }
);
