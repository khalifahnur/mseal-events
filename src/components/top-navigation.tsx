"use client"

import { Bell, LogOut, User } from "lucide-react"
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

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">M-seal Master</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <Button
              variant={activeSection === "events" ? "default" : "ghost"}
              onClick={() => setActiveSection("events")}
            >
              Events
            </Button>
            <Button
              variant={activeSection === "merchandise" ? "default" : "ghost"}
              onClick={() => setActiveSection("merchandise")}
            >
              Merchandise
            </Button>
            <Button
              variant={activeSection === "memberships" ? "default" : "ghost"}
              onClick={() => setActiveSection("memberships")}
            >
              Memberships
            </Button>
            <Button
              variant={activeSection === "settings" ? "default" : "ghost"}
              onClick={() => setActiveSection("settings")}
            >
              Settings
            </Button>
          </nav>

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

            {/* Mobile navigation */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="outline">Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setActiveSection("events")}>Events</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveSection("merchandise")}>Merchandise</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveSection("memberships")}>Memberships</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveSection("settings")}>Settings</DropdownMenuItem>
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
  )
}
