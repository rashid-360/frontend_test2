import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, CreditCard, DollarSign } from "lucide-react";
import { Toaster, toast } from 'react-hot-toast';
import { LoanDetailCard } from "../../../../Components/loan-detail-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockLoans } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AdminAxiosInstance from "../../../../axiosinstance/AdminAxiosInstance";
import { Skeleton } from "@/components/ui/skeleton";
import type { Loan } from "@/types";

export default function LoanDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loanId = Number(searchParams.get("id"));
  const [loan, setLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        setIsLoading(true);
        const response = await AdminAxiosInstance.get(`/api/admin/loan/${loanId}/`);
        setLoan(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching loan details:', err);
        setError('Failed to load loan details. Please try again later.');
        
        // Fallback to mock data in case of error
        const allLoans = Object.values(mockLoans).flat();
        const foundLoan = allLoans.find(loan => loan.id === loanId);
        if (foundLoan) {
          setLoan(foundLoan);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLoanDetails();
  }, [loanId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
 AdminAxiosInstance.delete(`/api/admin/loan/${loanId}/`).then((res)=>{

  toast.success('item deleted successfully ')
  window.location.href='/admin/loans/'
 })
    } catch (err) {
      console.error('Error deleting loan:', err);
      setIsDeleting(false);
    }
  };

  // Calculate loan status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      case "defaulted":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl space-y-8 px-4 py-6">
        <Toaster/>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/loans">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="mt-2 h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        
        <Separator />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex justify-between py-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !loan) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-destructive/10 p-6">
          <CreditCard className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Error Loading Loan</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button asChild className="mt-4">
          <Link to="/admin/loans">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Loans
          </Link>
        </Button>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-muted p-6">
          <CreditCard className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Loan not found</h1>
        <p className="text-muted-foreground">The loan you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link to="/admin/loans">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Loans
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/loans">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Loan #{loan.id}</h1>
            <p className="text-muted-foreground">{loan.name}</p>
          </div>
        </div>
        <Badge className={`${getStatusColor(loan.status)} px-3 py-1 text-xs font-medium`}>
          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
        </Badge>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Created on {new Date(loan.start_date).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="sm">
            Edit Loan
          </Button> */}
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Loan"}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <LoanDetailCard
          title="Loan Information"
          icon={CreditCard}
          items={[
            { label: "Loan ID", value: `#${loan.id}` },
            { label: "Loan Name", value: loan.name },
            { label: "Status", value: loan.status.charAt(0).toUpperCase() + loan.status.slice(1), badge: true },
            { label: "Start Date", value: new Date(loan.start_date).toLocaleDateString() },
          ]}
        />

        <LoanDetailCard
          title="Financial Details"
          icon={DollarSign}
          items={[
            { label: "Loan Amount", value: formatCurrency(loan.amount) },
            { label: "Interest Rate", value: `${loan.interest_rate}%` },
            { label: "Monthly Payment", value: formatCurrency(loan.monthly_payment) },
            { label: "Total Interest", value: formatCurrency(loan.total_interest) },
          ]}
        />

        <LoanDetailCard
          title="Loan Terms"
          icon={Calendar}
          items={[
            { label: "Tenure", value: `${loan.tenure} ${loan.tenure === 1 ? "month" : "months"}` },
            { label: "Total Amount", value: formatCurrency(loan.total_amount) },
            {
              label: "Foreclosure Amount",
              value: loan.foreclosure_amount ? formatCurrency(loan.foreclosure_amount) : "N/A",
            },
            {
              label: "Foreclosure Date",
              value: loan.foreclosure_date ? new Date(loan.foreclosure_date).toLocaleDateString() : "N/A",
            },
          ]}
        />
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/40">
          <CardTitle>Payment Schedule</CardTitle>
          <CardDescription>Monthly payment schedule for this loan</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">
                    Payment Date
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Principal</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Interest</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y">
  {(() => {
    const principal = Number.parseFloat(loan.amount.toString());
    const rate = loan.interest_rate / 100 / 12; // Convert annual rate to monthly
    const months = loan.tenure;
    
    // Calculate EMI
    const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);

    let balance = principal;

    return Array.from({ length: Math.min(months, 12) }).map((_, index) => {
      const date = new Date(loan.start_date);
      date.setMonth(date.getMonth() + index + 1);

      const interestCharged = balance * rate;
      const principalPaid = emi - interestCharged;
      balance -= principalPaid;

      return (
        <tr key={index} className="hover:bg-muted/50">
          <td className="whitespace-nowrap px-4 py-3 text-sm">{date.toLocaleDateString()}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm">{formatCurrency(principalPaid)}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm">{formatCurrency(interestCharged)}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm">{formatCurrency(emi)}</td>
          <td className="whitespace-nowrap px-4 py-3 text-sm">{formatCurrency(Math.max(0, balance))}</td>
        </tr>
      );
    });
  })()}
  {loan.tenure > 12 && (
    <tr>
      <td colSpan={5} className="px-4 py-3 text-center text-sm text-muted-foreground">
        <Button variant="link" size="sm">
          View all {loan.tenure} payments
        </Button>
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium">Loan Summary</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Total Principal</p>
            <p className="text-2xl font-bold">{formatCurrency(loan.amount)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Total Interest</p>
            <p className="text-2xl font-bold">{formatCurrency(loan.total_interest)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(loan.total_amount)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-2xl font-bold">{formatCurrency(loan.monthly_payment)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}