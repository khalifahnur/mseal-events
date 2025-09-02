"use client"

import { useEffect, useState } from "react"
import { AuthProvider, useAuth } from "@/components/auth/auth-context"
import { AuthPage } from "@/components/auth/auth-page"
import { Toaster } from "@/components/ui/toaster"
import { usePathname, useRouter } from "next/navigation"

function AuthenticatedContent() {
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [redirected, setRedirected] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading || redirected) return;

    if (user && !pathname.startsWith("/events")) {
      setRedirected(true);
      router.replace('/events');
    } else if (!user && pathname !== "/") {
      setRedirected(true);
      router.replace("/");
    }
  }, [mounted, isLoading, user, pathname, redirected, router]);

  // Reset redirected state when user changes (e.g., after login)
  useEffect(() => {
    setRedirected(false);
  }, [user]);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user && pathname === "/") {
    return <AuthPage />;
  }

  if (user && pathname.startsWith("/events")) {
    return null;
  }

  return null;
}

export function AuthenticatedApp() {
  return (
    <AuthProvider>
      <AuthenticatedContent />
      <Toaster />
    </AuthProvider>
  );
}
