'use client'

import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Applicant } from "@/lib/types";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { upsertApplicantAction } from "./actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApplicantFormProps {
    applicant?: Applicant;
    onFinished: () => void;
}

export function ApplicantForm({ applicant, onFinished }: ApplicantFormProps) {
    const [state, formAction] = useFormState(upsertApplicantAction, { success: false });
    const { toast } = useToast();

    useEffect(() => {
        if (state.success) {
            toast({ title: "Success", description: `Applicant ${applicant ? 'updated' : 'created'} successfully.` });
            onFinished();
        } else if (state.error) {
            toast({ variant: "destructive", title: "Error", description: state.error });
        }
    }, [state, applicant, onFinished, toast]);
    
    return (
        <form action={formAction} className="space-y-4">
            {applicant?.id && <input type="hidden" name="id" value={applicant.id} />}
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={applicant?.name} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" defaultValue={applicant?.email} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="status">Lottery Status</Label>
                <Select name="status" defaultValue={applicant?.status}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Received">Received</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Winner">Winner</SelectItem>
                        <SelectItem value="Not a Winner">Not a Winner</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" className="w-full">{applicant ? "Update" : "Create"} Applicant</Button>
        </form>
    )
}
