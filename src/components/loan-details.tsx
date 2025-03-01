"use client"

import { useState } from "react"
import type { Loan } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { generateAmortizationSchedule } from "@/lib/loan-calculations"
import UserAxiosInstance from '../axiosinstance/UserAxiosInstance'

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import toast, { Toaster } from "react-hot-toast"
interface LoanDetailsProps {
  loan: Loan
  onForeclose: (loanId: string, foreclosureDate: Date) => void
}

export default function LoanDetails({ loan, onForeclose }: LoanDetailsProps) {
  const [foreclosureDate, setForeclosureDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const data = [
    { name: "Principal", value: loan.amount, color: "#8884d8" },
    { name: "Interest", value: loan.totalInterest, color: "#82ca9d" },
  ];
  const startDate = new Date(loan.startDate)
  const amortizationSchedule = generateAmortizationSchedule(loan.amount, loan.interestRate, loan.tenure, startDate)

  const calculateForeclosureAmount = (amortizationSchedule: any[], foreclosureDate: Date) => {
    const foreclosureEntry = amortizationSchedule.find(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= foreclosureDate;
    });

    if (foreclosureEntry) {
      return foreclosureEntry.balance;
    }

    return 0; // If no entry is found, return 0 or handle accordingly
  };

  const handleForeclose = () => {
    if (foreclosureDate) {
      const foreclosureAmount = calculateForeclosureAmount(amortizationSchedule, foreclosureDate);
  
      UserAxiosInstance.patch(`/api/loans/${loan.id}/`, {
        id: loan.id,
        foreclosure_date: foreclosureDate.toISOString().split("T")[0],
        status: 'closed',
        foreclosure_amount: foreclosureAmount.toFixed(2) // Include the foreclosure amount
      })
      .then((res) => {
        toast.success('Foreclosure successful');
  
        setTimeout(() => {
          window.location.reload(); // Reload the page after toast is shown
        }, 1000); // Wait for 2 seconds to let the toast be visible
      })
      .catch((error) => {
        console.error("Error foreclosing loan:", error);
      });
  
      onForeclose(loan.id, foreclosureDate);
      setIsDialogOpen(false);
    }
  };
  

  return (
    <div className="space-y-6">
      <Toaster/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Loan Summary</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Loan Name</dt>
                <dd>{loan.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Principal Amount</dt>
                <dd>{formatCurrency(loan.amount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Interest Rate</dt>
                <dd>{loan.interestRate}% per annum</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tenure</dt>
                <dd>{loan.tenure} months</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Start Date</dt>
                <dd>{formatDate(loan.startDate)}</dd>
              </div>
              {loan.status === "closed" && loan.endDate && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">End Date</dt>
                  <dd>{formatDate(loan.endDate)}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Payment Details</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Monthly Payment</dt>
                <dd>{formatCurrency(loan.monthlyPayment)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total Interest</dt>
                <dd>{formatCurrency(loan.totalInterest)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total Amount</dt>
                <dd>{formatCurrency(loan.totalAmount)}</dd>
              </div>
              {loan.status === "closed" && loan.foreclosureAmount && (
                <div className="flex justify-between font-medium">
                  <dt className="text-muted-foreground">Foreclosure Amount</dt>
                  <dd>{formatCurrency(loan.foreclosureAmount)}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">Amortization Schedule</TabsTrigger>
          <TabsTrigger value="chart">Interest Breakdown</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule" className="pt-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left">Month</th>
                    <th className="px-4 py-2 text-left">Payment Date</th>
                    <th className="px-4 py-2 text-right">Payment</th>
                    <th className="px-4 py-2 text-right">Principal</th>
                    <th className="px-4 py-2 text-right">Interest</th>
                    <th className="px-4 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortizationSchedule.map((entry, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{formatDate(entry.date)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(entry.payment)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(entry.principal)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(entry.interest)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(entry.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="chart" className="pt-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-8 border-primary relative flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Total Interest</div>
                  <div className="font-bold">{formatCurrency(loan.totalInterest)}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary rounded-full mr-2"></div>
                <span>Interest: {formatCurrency(loan.totalInterest)}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-muted rounded-full mr-2"></div>
                <span>Principal: {formatCurrency(loan.amount)}</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {loan.status === "active" && (
        <div className="flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Foreclose Loan</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Foreclose Loan</DialogTitle>
                <DialogDescription>
                  Select a date to foreclose this loan. Interest will be calculated up to this date.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
              <Calendar
  mode="single"
  selected={foreclosureDate}
  onSelect={setForeclosureDate}
  disabled={(date) => {
    // Convert start and end dates to Date objects
    const startDate = new Date(loan.startDate);
    const endDate = new Date(loan.endDate);

    // Disable dates before startDate and after endDate
    return date < startDate || date > endDate;
  }}
  className="mx-auto"
/>

              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleForeclose}>
                  Confirm Foreclosure
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}