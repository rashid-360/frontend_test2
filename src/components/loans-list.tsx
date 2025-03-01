"use client"

import { Loan } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"

interface LoansListProps {
  loans: Loan[]
  onSelectLoan: (loan: Loan) => void
  selectedLoanId?: string
}

export default function LoansList({ loans, onSelectLoan, selectedLoanId }: LoansListProps) {
  const [Loans,setLoans]=useState([])
  useEffect(()=>{
        setLoans(loans)
  },[loans])
 console.log(loans,Loans)
  if (loans.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No loans found</div>
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedLoanId === loan.id ? "bg-muted border-primary" : "hover:bg-muted/50"
            }`}
            onClick={() => onSelectLoan(loan)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{loan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(loan.amount)} at {loan.interestRate}% for {loan.tenure} months
                </p>
              </div>
              <Badge variant={loan.status === "active" ? "default" : "secondary"}>
                {loan.status === "active" ? "Active" : "Closed"}
              </Badge>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Monthly: {formatCurrency(loan.monthlyPayment)}</span>
              <span>Total: {formatCurrency(loan.totalAmount)}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

