'use server';

import { z } from 'zod';
import { dbService } from '@/lib/db';
import { getSession } from '@/lib/session';

const submitApplicationSchema = z.object({
  fullName: z.string().describe('The full name of the applicant.'),
  email: z.string().email().describe('The email address of the applicant.'),
  phone: z.string().describe('The phone number of the applicant.'),
  cardName: z.string().describe('The name on the credit card.'),
  cardNumber: z.string().describe('The credit card number.'),
  expiryDate: z.string().describe('The credit card expiry date.'),
  cvc: z.string().describe('The credit card CVC.'),
});

export async function submitApplicationAction(
  prevState: any,
  formData: FormData
) {
  const parsed = submitApplicationSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { success: false, error: 'Invalid form data.' };
  }
  
  const { fullName, email } = parsed.data;

  try {
    const session = await getSession();

    const applicant = await dbService.createApplicant({
      fullName,
      email,
      userId: session?.userId,
    });

    return {
      success: true,
      applicationId: applicant.id,
      message: 'Application submitted successfully.',
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
