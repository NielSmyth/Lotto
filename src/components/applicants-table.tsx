
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
import { Suspense, useState } from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal, Pencil, Search, Ticket, Trash2 } from "lucide-react";
import { deleteApplicantAction } from "@/app/dashboard/actions";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { ApplicantForm } from "@/app/dashboard/applicant-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Skeleton } from "./ui/skeleton";

interface ApplicantsTableProps {
  applicants: Applicant[];
  isAdmin?: boolean;
}

const TableSkeleton = () => (
    <div className="space-y-2">
      <div className="flex items-center py-4 gap-4">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-10 w-28 ml-auto" />
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(7)].map((_, i) => <TableCell key={i}><Skeleton className="h-5 w-full" /></TableCell>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(7)].map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
);


const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-md border-2 border-dashed">
        <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Applicants Found</h3>
        <p className="text-muted-foreground">
            Your search or filter criteria did not match any applicants.
        </p>
    </div>
)

const NoApplications = () => (
     <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-md border-2 border-dashed">
        <Ticket className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">You haven't applied yet!</h3>
        <p className="text-muted-foreground mb-6">
           It looks like you don't have any lottery applications.
        </p>
        <Button>Apply Now</Button>
    </div>
)


export default function ApplicantsTable({ applicants, isAdmin = false }: ApplicantsTableProps) {
    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set(['Paid', 'Pending', 'Failed']));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | undefined>(undefined);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [applicantToDelete, setApplicantToDelete] = useState<string | null>(null);
    const [detailsApplicant, setDetailsApplicant] = useState<Applicant | undefined>(undefined);
    
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
    
    const handleDeleteClick = (id: string) => {
        setApplicantToDelete(id);
        setIsDeleteDialogOpen(true);
    }
    
    const handleRowClick = (applicant: Applicant) => {
      if (!isAdmin) {
        setDetailsApplicant(applicant);
      }
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

    const handleDeleteConfirm = async () => {
        if (!applicantToDelete) return;
        const result = await deleteApplicantAction(applicantToDelete);
        if (result.success) {
            toast({ title: "Success", description: "Applicant deleted successfully." });
        } else {
            toast({ variant: "destructive", title: "Error", description: result.error });
        }
        setIsDeleteDialogOpen(false);
        setApplicantToDelete(null);
    }
    
    if (!applicants) {
        return <TableSkeleton />;
    }

    if (applicants.length === 0 && !isAdmin) {
        return <NoApplications />;
    }

  return (
    <>
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{selectedApplicant ? 'Edit Applicant' : 'Add New Applicant'}</DialogTitle>
                <DialogDescription>
                    {selectedApplicant ? "Update the applicant's details below." : "Fill out the form below to add a new applicant."}
                </DialogDescription>
            </DialogHeader>
            <ApplicantForm applicant={selectedApplicant} onFinished={() => setIsFormOpen(false)} />
        </DialogContent>
    </Dialog>

    <Dialog open={!!detailsApplicant} onOpenChange={(isOpen) => !isOpen && setDetailsApplicant(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
                Viewing details for application <span className="font-mono font-semibold">{detailsApplicant?.id}</span>
            </DialogDescription>
          </DialogHeader>
          {detailsApplicant && (
             <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Full Name:</span>
                    <span className="font-semibold">{detailsApplicant.name}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-semibold">{detailsApplicant.email}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Submission Date:</span>
                    <span className="font-semibold">{new Date(detailsApplicant.submissionDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <Badge variant={getStatusVariant(detailsApplicant.paymentStatus)} className="capitalize">
                        {detailsApplicant.paymentStatus}
                    </Badge>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Lottery Status:</span>
                     <Badge variant={getLotteryStatusVariant(detailsApplicant.status)} className="capitalize">
                        {detailsApplicant.status}
                    </Badge>
                </div>
             </div>
          )}
        </DialogContent>
    </Dialog>
    
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
                <TableRow 
                    key={applicant.id}
                    onClick={() => handleRowClick(applicant)}
                    className={!isAdmin ? 'cursor-pointer' : ''}
                    >
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
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(applicant.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    )}
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} className="h-48">
                       <EmptyState />
                    </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the applicant
                    and remove their data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
