"use client"

import { useState } from "react"
import { TenantStats } from "@/components/tenant-stats"
import { TenantList } from "@/components/tenant-list"
import { AddTenantModal } from "@/components/add-tenant-modal"
import type { Tenant } from "@/lib/tenants"

export default function TenantsPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTenantAdded = (tenant: Tenant) => {
    // Force refresh of components by updating key
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground">Manage and view all tenant information.</p>
        </div>
        <AddTenantModal onTenantAdded={handleTenantAdded} />
      </div>

      <TenantStats key={`stats-${refreshKey}`} />
      <TenantList key={`list-${refreshKey}`} onTenantAdded={handleTenantAdded} />
    </div>
  )
}
