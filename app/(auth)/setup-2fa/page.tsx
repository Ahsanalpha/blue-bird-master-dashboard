"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Shield, Copy, CheckCircle, Smartphone } from "lucide-react"

export default function Setup2FAPage() {
  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [secretCopied, setSecretCopied] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Mock secret key for demonstration
  const secretKey = "JBSWY3DPEHPK3PXP"
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/TenantsDashboard:admin@example.com?secret=${secretKey}&issuer=TenantsDashboard`

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secretKey)
      setSecretCopied(true)
      toast({
        title: "Secret copied",
        description: "The secret key has been copied to your clipboard.",
      })
      setTimeout(() => setSecretCopied(false), 3000)
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy secret key. Please copy it manually.",
        variant: "destructive",
      })
    }
  }

  const handleVerifySetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate verification
    setTimeout(() => {
      if (verificationCode === "123456") {
        toast({
          title: "2FA setup complete",
          description: "Two-factor authentication has been successfully enabled!",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Invalid code",
          description: "The verification code is incorrect. Please try again.",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="w-full max-w-lg shadow-lg border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold font-montserrat">Setup Two-Factor Authentication</CardTitle>
        <CardDescription className="text-muted-foreground">
          Secure your account with an additional layer of protection
        </CardDescription>
      </CardHeader>

      {step === 1 && (
        <>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <Smartphone className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Step 1: Install an Authenticator App</h3>
                <p className="text-sm text-muted-foreground">
                  Download and install an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator
                  on your mobile device.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setStep(2)} className="w-full bg-primary hover:bg-primary/90">
              I have an authenticator app
            </Button>
          </CardFooter>
        </>
      )}

      {step === 2 && (
        <>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="font-semibold">Step 2: Scan QR Code or Enter Secret</h3>
              <div className="flex justify-center">
                <img
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt="QR Code for 2FA setup"
                  className="border rounded-lg"
                  width={200}
                  height={200}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Can't scan the QR code? Enter this secret key manually:</p>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <code className="flex-1 text-sm font-mono">{secretKey}</code>
                  <Button type="button" variant="ghost" size="sm" onClick={handleCopySecret} className="h-8 w-8 p-0">
                    {secretCopied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep(3)} className="flex-1 bg-primary hover:bg-primary/90">
              Next
            </Button>
          </CardFooter>
        </>
      )}

      {step === 3 && (
        <>
          <form onSubmit={handleVerifySetup}>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold">Step 3: Verify Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app to complete the setup.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-lg font-mono bg-background"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Complete Setup"}
              </Button>
            </CardFooter>
          </form>
        </>
      )}

      <div className="px-6 pb-6">
        <Link
          href="/login"
          className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary"
        >
          Skip for now
        </Link>
      </div>
    </Card>
  )
}
