"use client"

import { fetchAdminInfo } from "@/lib/api"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "staff",
  firstName: string
  lastName: string
  phoneNumber: string
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  signOut: () => void;
  setUser: (user: User | null) => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = await fetchAdminInfo();
        console.log(userData)
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch user on init", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);


  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticating, 
      signOut,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}