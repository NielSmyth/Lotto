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
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface ApplicantsTableProps {
  applicants: Applicant[];
}

export default function ApplicantsTable({ applicants }: ApplicantsTableProps) {
    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set(['Paid', 'Pending', 'Failed']));

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

    const filteredApplicants = applicants.filter(applicant =>
        (applicant.name.toLowerCase().includes(filter.toLowerCase()) ||
        applicant.email.toLowerCase().includes(filter.toLowerCase()) ||
        applicant.id.toLowerCase().includes(filter.toLowerCase())) &&
        statusFilter.has(applicant.paymentStatus)
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

  return (
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
                    Status <ChevronDown className="ml-2 h-4 w-4" />
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
        </div>
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Applicant ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead className="text-right">Payment Status</TableHead>
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
                    <TableCell className="text-right">
                    <Badge variant={getStatusVariant(applicant.paymentStatus)} className="capitalize">
                        {applicant.paymentStatus}
                    </Badge>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        No results found.
                    </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
    </div>
  );
}
