"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import type { Loan } from "@/types"
import { ChevronDown, MoreHorizontal, Search } from "lucide-react"
import AdminAxiosInstance from '../axiosinstance/AdminAxiosInstance'
import toast, { Toaster } from "react-hot-toast"
import { useState } from "react"

interface LoanTableProps {
  loans: Loan[]
}

export function LoanTable({ loans }: LoanTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Loan>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: keyof Loan) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredLoans = loans.filter(
    (loan) =>
      loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.id.toString().includes(searchTerm),
  )

  const handleDelete = async (loanId) => {
    
    try {
 AdminAxiosInstance.delete(`/api/admin/loan/${loanId}/`).then((res)=>{

  toast.success('item deleted successfully ')
  window.location.href='/admin/loans/'
 })
    } catch (err) {
      console.error('Error deleting loan:', err);
      
    }
  };

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    const aStr = String(aValue)
    const bStr = String(bValue)

    if (!isNaN(Number(aStr)) && !isNaN(Number(bStr))) {
      return sortDirection === "asc" ? Number(aStr) - Number(bStr) : Number(bStr) - Number(aStr)
    }

    return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })

  return (
    <div className="space-y-4">
      <Toaster/>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search loans..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                <div className="flex items-center gap-1">
                  ID
                  {sortField === "id" && (
                    <ChevronDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">
                  Name
                  {sortField === "name" && (
                    <ChevronDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                <div className="flex items-center gap-1">
                  Amount
                  {sortField === "amount" && (
                    <ChevronDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("tenure")}>
                <div className="flex items-center gap-1">
                  Tenure
                  {sortField === "tenure" && (
                    <ChevronDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("interest_rate")}>
                <div className="flex items-center gap-1">
                  Rate
                  {sortField === "interest_rate" && (
                    <ChevronDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                <div className="flex items-center gap-1">
                  Status
                  {sortField === "status" && (
                    <ChevronDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("start_date")}>
                <div className="flex items-center gap-1">
                  Start Date
                  {sortField === "start_date" && (
                    <ChevronDown className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLoans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No loans found.
                </TableCell>
              </TableRow>
            ) : (
              sortedLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">#{loan.id}</TableCell>
                  <TableCell>{loan.name}</TableCell>
                  <TableCell>{formatCurrency(loan.amount)}</TableCell>
                  <TableCell>
                    {loan.tenure} {loan.tenure === 1 ? "month" : "months"}
                  </TableCell>
                  <TableCell>{loan.interest_rate}%</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        loan.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(loan.start_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <a href={`/admin/loans/detail?id=${loan.id}`}>View details</a>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>Edit</DropdownMenuItem> */}
                        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

