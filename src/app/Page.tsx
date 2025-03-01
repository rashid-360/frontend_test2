"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import AddLoanForm from "../components/add-loan-form";
import LoansList from "../components/loans-list";
import LoanDetails from "../components/loan-details";
import type { Loan } from "../lib/types";
import UserAxiosInstance from "../axiosinstance/UserAxiosInstance";
import LoanUsernav from "../Components/loanusernav";

const calculateEMI = (principal: number, annualRate: number, tenure: number) => {
  const monthlyRate = annualRate / 100 / 12; // Convert to decimal
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - principal;
  
  return {
    monthlyPayment: parseFloat(emi.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
  };
};

export default function Home() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch loans from API
  useEffect(() => {
    UserAxiosInstance.get('/api/loans')
      .then((res) => {
        console.log("API Response:", res.data);
  
        const formattedLoans: Loan[] = res.data.map((loan: any) => {
          // Calculate endDate by adding tenure (in months) to startDate
          const endDate = new Date(new Date(loan.start_date).setMonth(new Date(loan.start_date).getMonth() + loan.tenure));
  
          return {
            id: String(loan.id), // Ensure ID is a string
            name: loan.name,
            amount: parseFloat(loan.amount),
            interestRate: loan.interest_rate,
            tenure: loan.tenure,
            startDate: loan.start_date,
            status: loan.status,
            monthlyPayment: parseFloat(loan.monthly_payment),
            totalInterest: parseFloat(loan.total_interest),
            totalAmount: parseFloat(loan.total_amount),
            foreclosureAmount: parseFloat(loan.foreclosure_amount),
            endDate: new Date(endDate).toISOString().split("T")[0], // Format as YYYY-MM-DD
          };
        });
  
        setLoans(formattedLoans);
      })
      .catch((error) => {
        console.error("Error fetching loans:", error);
      });
  }, []);
console.log('loans is ',loans)
  const handleForeclose = (loanId: string, foreclosureDate: Date) => {
    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.id === loanId
          ? { ...loan, status: "closed", endDate: foreclosureDate.toISOString() }
          : loan
      )
    );
  };

  const addLoan = (loan: Loan) => {
    const newLoan = { ...loan, ...calculateEMI(loan.amount, loan.interestRate, loan.tenure) };
    setLoans([...loans, newLoan]);
  };

  const filteredLoans = activeTab === "all" ? loans : loans.filter((loan) => loan.status === activeTab);

  return (
    <main className="container mx-auto py-8 px-4">
      <LoanUsernav/>
      <h1 className="text-3xl font-bold mb-8 text-center"></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add New Loan</CardTitle>
            <CardDescription>Enter loan details to create a new loan</CardDescription>
          </CardHeader>
          <CardContent>
            <AddLoanForm onAddLoan={addLoan} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Loans</CardTitle>
            <CardDescription>View and manage your loans</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Loans</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>
                <LoansList loans={filteredLoans} onSelectLoan={setSelectedLoan} selectedLoanId={selectedLoan?.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {selectedLoan && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
            <CardDescription>
              {selectedLoan.status === "active" ? "Active loan details" : "Closed loan details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoanDetails loan={selectedLoan} onForeclose={handleForeclose} />
          </CardContent>
        </Card>
      )}
    </main>
  );
}
