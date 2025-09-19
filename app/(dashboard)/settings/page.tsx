'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function AdminSettingsPage() {
  const { user } = useAuth()

  interface User {
  id: number;
  email: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_number: string;
  two_factor_auth: boolean;
  verified: boolean;
  created_at: string;  // ISO date string format (e.g. "2025-09-16T12:34:56Z")
  updated_at: string;  // ISO date string format
}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your admin account settings and preferences</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Please enter your first name" defaultValue={user?.first_name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" placeholder="please enter your middle name" defaultValue={user?.middle_name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="please enter your last name" defaultValue={user?.last_name} />
              </div>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="please enter " defaultValue="admin" />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" defaultValue={user?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+27 71 234 5678" defaultValue={user?.phone_number} />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and security preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Permissions */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Admin Permissions</CardTitle>
          <CardDescription>Configure your administrative access and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Administrative Permissions</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="manage-tenants" defaultChecked />
                  <Label htmlFor="manage-tenants">Manage Tenants</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="view-analytics" defaultChecked />
                  <Label htmlFor="view-analytics">View Analytics & Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="manage-billing" defaultChecked />
                  <Label htmlFor="manage-billing">Manage Billing & Subscriptions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="system-settings" defaultChecked />
                  <Label htmlFor="system-settings">System Configuration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="user-management" defaultChecked />
                  <Label htmlFor="user-management">User Management</Label>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card> */}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">Save All Changes</Button>
      </div>
    </div>
  )
}
