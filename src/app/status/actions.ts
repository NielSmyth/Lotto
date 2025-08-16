'use server';

import { z } from 'zod';
import { dbService } from '@/lib/db';

const getApplicationStatusSchema = z.object({
  applicationId: z.string().describe('The unique ID of the application.'),
});

export async function getApplicationStatusAction(
  prevState: any,
  formData: FormData
) {
  const parsed = getApplicationStatusSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!parsed.success) {
    return { success: false, error: 'Invalid Application ID.' };
  }

  try {
    const applicant = await dbService.getApplicant(parsed.data.applicationId);

    if (!applicant) {
      return {
        success: true,
        result: {
          id: parsed.data.applicationId,
          found: false,
        },
      };
    }

    return {
      success: true,
      result: {
        id: applicant.id,
        found: true,
        status: applicant.status,
        submissionDate: applicant.submissionDate,
      },
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
