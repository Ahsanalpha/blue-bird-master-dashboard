import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "../globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Authentication - Tenants Management Dashboard",
  description: "Sign in to access the superuser dashboard for managing tenants",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // <html lang="en">
    //   <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center p-4">
            <div className="w-full max-w-md">{children}</div>
          </div>
          <Toaster />
        </AuthProvider>
    //   </body>
    // </html>
  )
}
