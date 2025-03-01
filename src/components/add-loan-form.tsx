"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Loan } from "@/lib/types"
import { calculateMonthlyPayment } from "@/lib/loan-calculations"
import UserAxiosInstance from "../axiosinstance/UserAxiosInstance"
import toast, { Toaster } from "react-hot-toast"

interface AddLoanFormProps {
  onAddLoan: (loan: Loan) => void
}

export default function AddLoanForm({ onAddLoan }: AddLoanFormProps) {
  const [amount, setAmount] = useState<string>("")
  const [tenure, setTenure] = useState<string>("")
  const [interestRate, setInterestRate] = useState<string>("")
  const [loanName, setLoanName] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!amount || !tenure || !interestRate || !loanName) {
      setError("All fields are required")
      return
    }

    const amountValue = Number.parseFloat(amount)
    const tenureValue = Number.parseInt(tenure)
    const interestRateValue = Number.parseFloat(interestRate)

    if (isNaN(amountValue) || amountValue < 1000 || amountValue > 100000) {
      setError("Please enter a valid loan amount between ₹1,000 and ₹100,000");
      return;
    }
    
    if (isNaN(tenureValue) || tenureValue < 3 || tenureValue > 24 || !Number.isInteger(tenureValue)) {
      setError("Please enter a valid tenure between 3 and 24 months (whole number)");
      return;
    }
    
    if (isNaN(interestRateValue) || interestRateValue <= 0) {
      setError("Please enter a valid interest rate");
      return;
    }
    
    // Calculate monthly payment
    const monthlyPayment = calculateMonthlyPayment(amountValue, interestRateValue, tenureValue)

    // Create new loan object
    const newLoan: Loan = {
      id: Date.now().toString(),
      name: loanName,
      amount: amountValue,
      tenure: tenureValue,
      interestRate: interestRateValue,
      startDate: new Date().toISOString(),
      status: "active",
      monthlyPayment,
      totalInterest: monthlyPayment * tenureValue - amountValue,
      totalAmount: monthlyPayment * tenureValue,
    }

    // Add the loan
    onAddLoan(newLoan)
    UserAxiosInstance.post('/api/loans/',{

      name:newLoan.name,
      amount:newLoan.amount,
      tenure:newLoan.tenure,
      interest_rate:newLoan.interestRate
    }).then((res)=>{

      toast.success('loan added succesfuly ')
    })
    // Reset form
    setAmount("")
    setTenure("")
    setInterestRate("")
    setLoanName("")
    setError("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="space-y-2">
        <Toaster/>
        <Label htmlFor="loanName">Loan Name</Label>
        <Input
          id="loanName"
          type="text"
          placeholder="e.g. Home Loan, Car Loan"
          value={loanName}
          onChange={(e) => setLoanName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Loan Amount</Label>
        <Input
          id="amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tenure">Tenure (months)</Label>
        <Input
          id="tenure"
          type="number"
          placeholder="Enter tenure in months"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interestRate">Interest Rate (%)</Label>
        <Input
          id="interestRate"
          type="number"
          step="0.01"
          placeholder="Enter annual interest rate"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        Add Loan
      </Button>
    </form>
  )
}

