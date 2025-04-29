"use client"

import { useEffect, useState } from "react"
import { AuthProvider, useAuth } from "@/components/auth/auth-context"
import { AuthPage } from "@/components/auth/auth-page"
import { Dashboard } from "@/components/dashboard"
import { Toaster } from "@/components/ui/toaster"

function AuthenticatedContent() {
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return user ? <Dashboard /> : <AuthPage />
}



export function AuthenticatedApp() {
  return (
    <AuthProvider>
      <AuthenticatedContent />
      <Toaster />
    </AuthProvider>
  )
}
