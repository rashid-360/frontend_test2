import type { AmortizationEntry } from "./types"

export function calculateMonthlyPayment(principal: number, annualInterestRate: number, tenureInMonths: number): number {
  // Convert annual interest rate to monthly rate and decimal form
  const monthlyInterestRate = annualInterestRate / 100 / 12

  // Calculate monthly payment using the formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  if (monthlyInterestRate === 0) {
    return principal / tenureInMonths
  }

  const numerator = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths)
  const denominator = Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1

  return numerator / denominator
}

export function generateAmortizationSchedule(
  principal: number,
  annualInterestRate: number,
  tenureInMonths: number,
  startDate: Date,
): AmortizationEntry[] {
  const monthlyPayment = calculateMonthlyPayment(principal, annualInterestRate, tenureInMonths)
  const monthlyInterestRate = annualInterestRate / 100 / 12

  let remainingBalance = principal
  const schedule: AmortizationEntry[] = []

  for (let month = 0; month < tenureInMonths; month++) {
    // Calculate interest for this month
    const interestPayment = remainingBalance * monthlyInterestRate

    // Calculate principal for this month
    const principalPayment = monthlyPayment - interestPayment

    // Update remaining balance
    remainingBalance -= principalPayment

    // Calculate payment date
    const paymentDate = new Date(startDate)
    paymentDate.setMonth(paymentDate.getMonth() + month + 1)

    // Add entry to schedule
    schedule.push({
      date: paymentDate.toISOString(),
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, remainingBalance), // Ensure balance doesn't go below 0 due to rounding
    })
  }

  return schedule
}

