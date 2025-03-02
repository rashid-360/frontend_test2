"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockLoans } from "@/lib/data"
import { CreditCard, Download, Plus, Search, Users } from "lucide-react"
import { LoanTable } from "../Components/loan-table"
import { useEffect, useState } from "react"
import AdminAxiosInstance from "../axiosinstance/AdminAxiosInstance"
import Usernav from "../Components/user-nav"
import type { Loan } from "@/types"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

type UserLoansData = Record<string, Loan[]>

export default function LoansPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [loansData, setLoansData] = useState<UserLoansData>({})
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Get all loans as a flat array
  const allLoans = Object.values(loansData).flat()
  const activeLoans = allLoans.filter((loan) => loan.status === "active")
  const closedLoans = allLoans.filter((loan) => loan.status === "closed")
  const userNames = Object.keys(loansData)

  // Filter users based on search term
  const filteredUserNames = userNames.filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setIsLoading(true)
        const response = await AdminAxiosInstance.get("/api/admin/get/loans/")
        setLoansData(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching loans:", err)
        setError("Failed to load loans data. Please try again later.")
        // Fallback to mock data in case of error
        setLoansData(mockLoans)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoans()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4 space-y-8 bg-background min-h-screen">
      <Usernav />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Loans Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Comprehensive overview of all loan records in the system</p>
        </div>
        <div className="flex items-center gap-3">
          {/* <Button
            variant="outline"
            size="sm"
            className="h-9 transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="h-9 transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Add Loan
          </Button> */}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6 border border-destructive/20 shadow-sm animate-in fade-in duration-300">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="overflow-hidden border-l-4 border-l-primary shadow-md hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:bg-muted/30 transition-colors">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <div className="rounded-full bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16 rounded-md" />
            ) : (
              <div className="text-3xl font-bold">{allLoans.length}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">All time loans</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:bg-muted/30 transition-colors">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <div className="rounded-full bg-green-500/10 p-2 group-hover:bg-green-500/20 transition-colors">
              <CreditCard className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16 rounded-md" />
            ) : (
              <div className="text-3xl font-bold">{activeLoans.length}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-red-500 shadow-md hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:bg-muted/30 transition-colors">
            <CardTitle className="text-sm font-medium">Closed Loans</CardTitle>
            <div className="rounded-full bg-red-500/10 p-2 group-hover:bg-red-500/20 transition-colors">
              <CreditCard className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16 rounded-md" />
            ) : (
              <div className="text-3xl font-bold">{closedLoans.length}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Completed loans</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:bg-muted/30 transition-colors">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <div className="rounded-full bg-purple-500/10 p-2 group-hover:bg-purple-500/20 transition-colors">
              <Users className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16 rounded-md" />
            ) : (
              <div className="text-3xl font-bold">{userNames.length}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">With active loans</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="by-user" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <TabsList className="mb-0">
            <TabsTrigger
              value="by-user"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              By User
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All Loans
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9 w-full sm:w-[250px] h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="animate-in fade-in-50 duration-300">
          <Card className="shadow-md border border-border/50">
            <CardHeader className="border-b bg-muted/40 pb-4">
              <CardTitle>All Loans</CardTitle>
              <CardDescription>View and manage all loan records in the system.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <LoanTable loans={allLoans} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-user" className="animate-in fade-in-50 duration-300">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="shadow-md border border-border/50">
                  <CardHeader className="border-b bg-muted/40 pb-4">
                    <div className="flex items-center">
                      <Skeleton className="h-6 w-6 mr-2 rounded-full" />
                      <Skeleton className="h-5 w-[180px]" />
                    </div>
                    <Skeleton className="h-4 w-[150px] mt-2" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[1, 2].map((j) => (
                        <div key={j} className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[200px]" />
                              <Skeleton className="h-3 w-[150px]" />
                            </div>
                          </div>
                          <Skeleton className="h-8 w-24 rounded-md" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredUserNames.length === 0 ? (
                <Card className="shadow-md border border-border/50">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    {searchTerm ? "No users match your search." : "No user loan data available."}
                  </CardContent>
                </Card>
              ) : (
                filteredUserNames.map((userName) => (
                  <Card
                    key={userName}
                    className="shadow-md border border-border/50 hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader className="border-b bg-muted/40 pb-4">
                      <CardTitle className="flex items-center">
                        <div className="bg-purple-500/10 p-2 rounded-full mr-3">
                          <Users className="h-5 w-5 text-purple-500" />
                        </div>
                        <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
                          {userName}
                        </span>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {loansData[userName].length} loan(s)
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">
                          {loansData[userName].filter((loan) => loan.status === "active").length} active
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500">
                          {loansData[userName].filter((loan) => loan.status === "closed").length} closed
                        </span>
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
  )
}

