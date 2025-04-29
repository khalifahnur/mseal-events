"use client"

import { useState } from "react"
import { SignInForm } from "@/components/auth/sign-in-form"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { Ticket } from "lucide-react"

export function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ticket className="h-8 w-8" />
          <h1 className="text-3xl font-bold">M-Seal Master</h1>
        </div>
        <p className="text-muted-foreground">Your complete M-seal management solution</p>
      </div>

      {isSignIn ? (
        <SignInForm onSignUpClick={() => setIsSignIn(false)} />
      ) : (
        <SignUpForm onSignInClick={() => setIsSignIn(true)} />
      )}
    </div>
  )
}
