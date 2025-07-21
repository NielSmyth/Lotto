'use server'

import { dbService } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const applicantSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Name is required."),
    email: z.string().email("Invalid email address."),
    status: z.enum(['Received', 'Processing', 'Winner', 'Not a Winner'])
});

export async function upsertApplicantAction(formData: FormData) {
    const parsed = applicantSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
        return { success: false, error: "Invalid form data." };
    }

    const { id, ...data } = parsed.data;

    try {
        if (id) {
            await dbService.updateApplicant(id, data);
        } else {
             await dbService.createApplicant({ fullName: data.name, email: data.email });
        }
        revalidatePath("/dashboard");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}


export async function deleteApplicantAction(id: string) {
    try {
        await dbService.deleteApplicant(id);
        revalidatePath('/dashboard');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
