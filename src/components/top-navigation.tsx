"use client"

import { Bell, LogOut, User, Calendar, ShoppingBag, CreditCard, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TopNavigationProps {
  activeSection: "events" | "merchandise" | "memberships" | "settings"
  setActiveSection: (section: "events" | "merchandise" | "memberships" | "settings") => void
}

export function TopNavigation({ activeSection, setActiveSection }: TopNavigationProps) {
  const { user, signOut } = useAuth()
  const pendingNotifications = 2

  const handleSignOut = () => {
    signOut()
  }

  const navItems = [
    {
      id: "events" as const,
      label: "Events",
      icon: Calendar,
    },
    {
      id: "merchandise" as const,
      label: "Store",
      icon: ShoppingBag,
    },
    {
      id: "memberships" as const,
      label: "Members",
      icon: CreditCard,
    },
    {
      id: "settings" as const,
      label: "Settings",
      icon: Settings,
    },
  ]

  return (
    <>
      {/* Top Header - simplified */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">M-seal Master</h1>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full relative">
                    <Bell className="h-4 w-4" />
                    {pendingNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {pendingNotifications}
                      </span>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>New membership requires physical card</DropdownMenuItem>
                  <DropdownMenuItem>Low stock alert: Team Jersey</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name || "User"}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-gray-700 to-[#fae115]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon 
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isActive ? "scale-110" : ""
                    }`} 
                  />
                  <span className={`text-xs font-medium ${
                    isActive ? "font-semibold" : ""
                  }`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
      
    </>
  )
}