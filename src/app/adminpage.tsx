import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockLoans } from "@/lib/data";
import { CreditCard, Download, Plus, Users } from "lucide-react";
import { LoanTable } from "../Components/loan-table";
import { useEffect, useState } from "react";
import AdminAxiosInstance from "../axiosinstance/AdminAxiosInstance";
import Usernav from "../Components/user-nav";
import type { Loan } from "@/types";

type UserLoansData = Record<string, Loan[]>;

export default function LoansPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loansData, setLoansData] = useState<UserLoansData>({});
  const [error, setError] = useState<string | null>(null);
  
  // Get all loans as a flat array
  const allLoans = Object.values(loansData).flat();
  const activeLoans = allLoans.filter((loan) => loan.status === "active");
  const closedLoans = allLoans.filter((loan) => loan.status === "closed");
  const userNames = Object.keys(loansData);
  
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setIsLoading(true);
        const response = await AdminAxiosInstance.get('/api/admin/get/loans/');
        setLoansData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching loans:', err);
        setError('Failed to load loans data. Please try again later.');
        // Fallback to mock data in case of error
        setLoansData(mockLoans);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLoans();
  }, []);
  
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Usernav/>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
          <p className="text-muted-foreground mt-1">Manage all loan records in the system</p>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="h-9">
            <Plus className="mr-2 h-4 w-4" />
            Add Loan
          </Button> */}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <div className="rounded-full bg-primary/10 p-2">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? "..." : allLoans.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time loans</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-l-4 border-l-green-500 shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <div className="rounded-full bg-green-500/10 p-2">
              <CreditCard className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? "..." : activeLoans.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Loans</CardTitle>
            <div className="rounded-full bg-blue-500/10 p-2">
              <CreditCard className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? "..." : closedLoans.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Completed loans</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-l-4 border-l-purple-500 shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <div className="rounded-full bg-purple-500/10 p-2">
              <Users className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? "..." : userNames.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">With active loans</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Loans</TabsTrigger>
          <TabsTrigger value="by-user">By User</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/40 pb-4">
              <CardTitle>All Loans</CardTitle>
              <CardDescription>View and manage all loan records in the system.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse text-muted-foreground">Loading loans data...</div>
                </div>
              ) : (
                <LoanTable loans={allLoans} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="by-user">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-muted-foreground">Loading user data...</div>
            </div>
          ) : (
            <div className="space-y-6">
              {userNames.length === 0 ? (
                <Card className="shadow-sm">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No user loan data available.
                  </CardContent>
                </Card>
              ) : (
                userNames.map((userName) => (
                  <Card key={userName} className="shadow-sm">
                    <CardHeader className="border-b bg-muted/40 pb-4">
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                        {userName}
                      </CardTitle>
                      <CardDescription>
                        {loansData[userName].length} loan(s) - {' '}
                        {loansData[userName].filter(loan => loan.status === "active").length} active, {' '}
                        {loansData[userName].filter(loan => loan.status === "closed").length} closed
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <LoanTable loans={loansData[userName]} userName={userName} />
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}