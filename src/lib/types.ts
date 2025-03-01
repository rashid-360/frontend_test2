export interface Loan {
    id: string
    name: string
    amount: number
    tenure: number
    interestRate: number
    startDate: string
    status: "active" | "closed"
    monthlyPayment: number
    totalInterest: number
    totalAmount: number
    endDate?: string
    foreclosureAmount?: number
    foreclosureDate?: string
  }
  
  export interface AmortizationEntry {
    date: string
    payment: number
    principal: number
    interest: number
    balance: number
  }
  
  