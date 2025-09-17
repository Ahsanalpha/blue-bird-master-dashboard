"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  DollarSign,
  User,
  Clock,
  Edit,
  Save,
  X,
} from "lucide-react"
import { tenantApi, type Tenant } from "@/lib/tenants"
import { useToast } from "@/hooks/use-toast"

export default function TenantDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const tenantId = Number.parseInt(params.id as string)

  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Tenant>>({})
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const data = await tenantApi.getTenantById(tenantId)
        if (data) {
          setTenant(data)
          setFormData(data)
        }
      } catch (error) {
        console.error("Failed to fetch tenant:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTenant()
  }, [tenantId])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded animate-pulse w-48" />
            <div className="h-4 bg-muted rounded animate-pulse w-64" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded animate-pulse w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-20" />
                    <div className="h-6 bg-muted rounded animate-pulse w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h1 className="text-2xl font-bold">Tenant Not Found</h1>
        <p className="text-muted-foreground">The requested tenant could not be found.</p>
        <Button onClick={() => router.push("/tenants")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tenants
        </Button>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmedSave = async () => {
    setSaving(true)
    try {
      const updatedTenant = await tenantApi.updateTenant(tenantId, formData)
      setTenant(updatedTenant)
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Tenant information has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tenant information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
      setShowConfirmDialog(false)
    }
  }

  const handleCancel = () => {
    setFormData(tenant)
    setIsEditing(false)
  }

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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/tenants")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tenant Details</h1>
            <p className="text-muted-foreground">
              {isEditing ? "Edit" : "View"} detailed information for{" "}
              {isEditing ? formData.company_name : tenant.company_name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveClick} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Tenant
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company Name</label>
              {isEditing ? (
                <Input
                  value={formData.company_name || ""}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold">{tenant.company_name}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              {isEditing ? (
                <Input
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  {tenant.address}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company Email</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.contact_email || ""}
                  onChange={(e) => handleInputChange("contact_email", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {tenant.contact_email}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company Phone</label>
              {isEditing ? (
                <Input
                  value={formData.contact_phone || ""}
                  onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {tenant.contact_phone}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Person */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Person
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              {isEditing ? (
                <Input
                  value={formData.contact_person_name || ""}
                  onChange={(e) => handleInputChange("contact_person_name", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold">{tenant.contact_person_name}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.contact_person_email || ""}
                  onChange={(e) => handleInputChange("contact_person_email", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {tenant.contact_person_email}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              {isEditing ? (
                <Input
                  value={formData.contact_person_phone || ""}
                  onChange={(e) => handleInputChange("contact_person_phone", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {tenant.contact_person_phone}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Plan</label>
              {isEditing ? (
                <Select
                  value={formData.subscription_plan || ""}
                  onValueChange={(value) => handleInputChange("subscription_plan", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">{getPlanBadge(tenant.subscription_plan)}</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Billing Cycle</label>
              {isEditing ? (
                <Select
                  value={formData.billing_cycle || ""}
                  onValueChange={(value) => handleInputChange("billing_cycle", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="capitalize">{tenant.billing_cycle}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Subscription ID</label>
              <p className="font-mono text-sm">{tenant.current_subscription_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              {isEditing ? (
                <Select value={formData.status || ""} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">{getStatusBadge(tenant.status)}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Payment Date</label>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(tenant.last_payment_date)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Next Payment Due</label>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(tenant.next_payment_due)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Account Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Created</label>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(tenant.created_at)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(tenant.updated_at)}
              </p>
            </div>
          </div>
          <Separator />
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tenant ID</label>
            <p className="font-mono text-sm">{tenant.tenant_id}</p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save the changes to {formData.company_name}? This action will update the tenant's
              information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
