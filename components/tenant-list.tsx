"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreHorizontal, Mail, Phone, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { tenantApi, type Tenant } from "@/lib/tenants";


interface TenantListProps {
  onTenantAdded?: (tenant: Tenant) => void
}

export function TenantList({ onTenantAdded }: TenantListProps) {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage,setItemsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
  const fetchTenants = async () => {
    try {
      setLoading(true)
      const offset = (currentPage - 1) * itemsPerPage
      const data = await tenantApi.getTenants(offset, itemsPerPage)
      setTenants(data?.data?.tenants)        // expect backend returns { items: Tenant[], total: number }
      setTotalCount(data?.meta?.total)
    } catch (error) {
      console.error("Failed to fetch tenants:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchTenants()
}, [currentPage, itemsPerPage])



  useEffect(() => {
    if (onTenantAdded) {
      // This would be called when a new tenant is added
    }
  }, [onTenantAdded])

  const addTenant = (newTenant: Tenant) => {
    setTenants((prev) => [newTenant, ...prev])
  }

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.contact_person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.contact_person_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter
    const matchesPlan = planFilter === "all" || tenant.subscription_plan === planFilter
    return matchesSearch && matchesStatus && matchesPlan
  })

  const totalPages = Math.ceil(filteredTenants.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTenants = filteredTenants.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, planFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "free":
        return <Badge variant="outline">Free</Badge>
      case "standard":
        return <Badge variant="secondary">Standard</Badge>
      case "premium":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Premium
          </Badge>
        )
      case "enterprise":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            Enterprise
          </Badge>
        )
      default:
        return <Badge variant="outline">{plan}</Badge>
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const handleViewDetails = (tenantId: number) => {
    router.push(`/tenants/${tenantId}`)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tenant Directory</CardTitle>
          <CardDescription>Search and manage your tenants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Directory</CardTitle>
        <CardDescription>Search and manage your tenants</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Status: {statusFilter === "all" ? "All" : statusFilter}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>Suspended</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Plan: {planFilter === "all" ? "All" : planFilter}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPlanFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("free")}>Free</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("standard")}>Standard</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("premium")}>Premium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("enterprise")}>Enterprise</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Payment</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTenants.map((tenant) => (
              <TableRow key={tenant.tenant_id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {tenant.company_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{tenant.company_name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {tenant.address}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{tenant.contact_person_name}</div>
                    <div className="space-y-1">
                      <div className="text-sm flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {tenant.contact_person_email}
                      </div>
                      <div className="text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {tenant.contact_person_phone}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {getPlanBadge(tenant.subscription_plan)}
                    <div className="text-sm text-muted-foreground">{tenant.billing_cycle}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {formatDate(tenant.next_payment_due)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">{formatDate(tenant.created_at)}</div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(tenant.tenant_id)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Tenant</DropdownMenuItem>
                      <DropdownMenuItem>Manage Subscription</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Suspend Tenant</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredTenants.length)} of {filteredTenants.length}{" "}
              tenants
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-9 h-9 p-0"
                      >
                        {page}
                      </Button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
