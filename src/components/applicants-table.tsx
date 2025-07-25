"use client";

import type { Applicant } from "@/lib/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { deleteApplicantAction } from "@/app/dashboard/actions";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ApplicantForm } from "@/app/dashboard/applicant-form";

interface ApplicantsTableProps {
  applicants: Applicant[];
  isAdmin?: boolean;
}

export default function ApplicantsTable({ applicants, isAdmin = false }: ApplicantsTableProps) {
    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set(['Paid', 'Pending', 'Failed']));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | undefined>(undefined);
    const { toast } = useToast();

    const toggleStatusFilter = (status: string) => {
        setStatusFilter(prev => {
            const newSet = new Set(prev);
            if (newSet.has(status)) {
                newSet.delete(status);
            } else {
                newSet.add(status);
            }
            return newSet;
        });
    }
    
    const handleEditClick = (applicant: Applicant) => {
        setSelectedApplicant(applicant);
        setIsFormOpen(true);
    };

    const handleAddClick = () => {
        setSelectedApplicant(undefined);
        setIsFormOpen(true);
    }

    const filteredApplicants = applicants.filter(applicant =>
        (applicant.name.toLowerCase().includes(filter.toLowerCase()) ||
        applicant.email.toLowerCase().includes(filter.toLowerCase()) ||
        applicant.id.toLowerCase().includes(filter.toLowerCase())) &&
        (applicant.paymentStatus ? statusFilter.has(applicant.paymentStatus) : true)
    );

  const getStatusVariant = (status: Applicant['paymentStatus']): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "Paid":
        return "default";
      case "Pending":
        return "secondary";
      case "Failed":
        return "destructive";
      default:
        return "default";
    }
  };

  const getLotteryStatusVariant = (status: Applicant['status']): "default" | "secondary" | "destructive" | "outline" => {
     switch (status) {
      case "Winner":
        return "default";
      case "Not a Winner":
        return "destructive";
      case "Processing":
        return "secondary";
       case "Received":
         return "outline";
      default:
        return "outline";
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this applicant?")) {
        const result = await deleteApplicantAction(id);
        if (result.success) {
            toast({ title: "Success", description: "Applicant deleted successfully." });
        } else {
            toast({ variant: "destructive", title: "Error", description: result.error });
        }
    }
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
    <div>
        <div className="flex items-center py-4 gap-4">
            <Input
                placeholder="Filter by name, email, or ID..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="max-w-sm"
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                    Payment Status <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {['Paid', 'Pending', 'Failed'].map((status) => (
                    <DropdownMenuCheckboxItem
                        key={status}
                        className="capitalize"
                        checked={statusFilter.has(status)}
                        onCheckedChange={() => toggleStatusFilter(status)}
                    >
                        {status}
                    </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
             {isAdmin && (
                <Button onClick={handleAddClick}>Add Applicant</Button>
            )}
        </div>
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Applicant ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead>Lottery Status</TableHead>
                <TableHead className="text-right">Payment Status</TableHead>
                {isAdmin && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
            </TableHeader>
            <TableBody>
            {filteredApplicants.length > 0 ? (
                filteredApplicants.map((applicant) => (
                <TableRow key={applicant.id}>
                    <TableCell className="font-mono">{applicant.id}</TableCell>
                    <TableCell className="font-medium">{applicant.name}</TableCell>
                    <TableCell>{applicant.email}</TableCell>
                    <TableCell>{new Date(applicant.submissionDate).toLocaleDateString()}</TableCell>
                     <TableCell>
                        <Badge variant={getLotteryStatusVariant(applicant.status)} className="capitalize">
                            {applicant.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <Badge variant={getStatusVariant(applicant.paymentStatus)} className="capitalize">
                        {applicant.paymentStatus}
                    </Badge>
                    </TableCell>
                    {isAdmin && (
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditClick(applicant)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleDelete(applicant.id)} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    )}
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} className="text-center h-24">
                        No results found.
                    </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
         <DialogContent>
            <DialogHeader>
                <DialogTitle>{selectedApplicant ? 'Edit Applicant' : 'Add New Applicant'}</DialogTitle>
                <DialogDescription>
                    {selectedApplicant ? "Update the applicant's details below." : "Fill out the form below to add a new applicant."}
                </DialogDescription>
            </DialogHeader>
            <ApplicantForm applicant={selectedApplicant} onFinished={() => setIsFormOpen(false)} />
        </DialogContent>
    </div>
    </Dialog>
  );
}
