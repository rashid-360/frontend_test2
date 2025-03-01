"use client"

import { LoanDetailCard } from "@/components/loan-detail-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getMockLoans } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, CreditCard, User } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "react-router-dom";
export default function UserDetailPage() {
  const [searchParams] = useSearchParams()
  const userId = Number(searchParams.get("id"))
  const loans = getMockLoans()
  const userLoans = loans.filter((loan) => loan.user === userId)

  if (userLoans.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-muted-foreground">The user you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>
    )
  }

  const activeLoans = userLoans.filter((loan) => loan.status === "active")
  const closedLoans = userLoans.filter((loan) => loan.status === "closed")
  const totalLoanAmount = userLoans.reduce((sum, loan) => sum + Number.parseFloat(loan.amount), 0)
  const totalActiveAmount = activeLoans.reduce((sum, loan) => sum + Number.parseFloat(loan.amount), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <LoanDetailCard
          title="User Information"
          icon={User}
          items={[
            { label: "User ID", value: `#${userId}` },
            { label: "Name", value: `User ${userId}` },
            { label: "Email", value: `user${userId}@example.com` },
            { label: "Phone", value: "+1 (555) 123-4567" },
          ]}
        />

        <LoanDetailCard
          title="Loan Summary"
          icon={CreditCard}
          items={[
            { label: "Total Loans", value: `${userLoans.length}` },
            { label: "Active Loans", value: `${activeLoans.length}` },
            { label: "Closed Loans", value: `${closedLoans.length}` },
            { label: "Total Loan Amount", value: formatCurrency(totalLoanAmount) },
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan History</CardTitle>
          <CardDescription>All loans associated with this user.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">#{loan.id}</TableCell>
                    <TableCell>{loan.name}</TableCell>
                    <TableCell>{formatCurrency(loan.amount)}</TableCell>
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
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/loans/detail?id=${loan.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

