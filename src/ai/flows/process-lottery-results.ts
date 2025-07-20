'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-assisted lottery result processing.
 *
 * - processLotteryResults - A function that processes lottery results using AI.
 * - ProcessLotteryResultsInput - The input type for the processLotteryResults function.
 * - ProcessLotteryResultsOutput - The return type for the processLotteryResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessLotteryResultsInputSchema = z.object({
  lotteryEntriesDataUri: z
    .string()
    .describe(
      "A data URI containing the lottery entries data, must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  relevantRegulations: z
    .string()
    .describe('The relevant regulations for the lottery.'),
});
export type ProcessLotteryResultsInput = z.infer<typeof ProcessLotteryResultsInputSchema>;

const ProcessLotteryResultsOutputSchema = z.object({
  resultsSummary: z
    .string()
    .describe('A summary of the lottery results after AI processing.'),
  potentialAnomalies: z
    .string()
    .describe('Any potential anomalies or irregularities detected by the AI.'),
});
export type ProcessLotteryResultsOutput = z.infer<typeof ProcessLotteryResultsOutputSchema>;

export async function processLotteryResults(
  input: ProcessLotteryResultsInput
): Promise<ProcessLotteryResultsOutput> {
  return processLotteryResultsFlow(input);
}

const processLotteryResultsPrompt = ai.definePrompt({
  name: 'processLotteryResultsPrompt',
  input: {schema: ProcessLotteryResultsInputSchema},
  output: {schema: ProcessLotteryResultsOutputSchema},
  prompt: `You are an AI assistant helping post office staff to process lottery results efficiently.

You will analyze the lottery entries data and apply the relevant regulations to determine the lottery results.

Based on your analysis, you will provide a summary of the lottery results and highlight any potential anomalies or irregularities.

Lottery Entries Data: {{media url=lotteryEntriesDataUri}}
Relevant Regulations: {{{relevantRegulations}}}`,
});

const processLotteryResultsFlow = ai.defineFlow(
  {
    name: 'processLotteryResultsFlow',
    inputSchema: ProcessLotteryResultsInputSchema,
    outputSchema: ProcessLotteryResultsOutputSchema,
  },
  async input => {
    const {output} = await processLotteryResultsPrompt(input);
    return output!;
  }
);
