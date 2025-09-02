"use client";

import { Bell, LogOut, Settings, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchLogout } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCallback } from "react";

export function TopNavigation() {
  const { user, signOut } = useAuth();
  const pendingNotifications = 2;
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: fetchLogout,
    onSuccess: () => {
      toast.success("Logged- You have logged out successfully.", {
        position: "bottom-right"
      });
      localStorage.removeItem("admin_auth");
      signOut();
      router.replace("/");
    },
    onError: () => {
      toast.error("Logout failed.", {
        position: "bottom-right"
      });
    },
  });

  const handleSignOut = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logoutMutation]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
              M-seal Master
            </h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Bell className="h-4 w-4 text-gray-600" />
                  {pendingNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium border-2 border-white">
                      {pendingNotifications}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-w-sm">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {pendingNotifications > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {pendingNotifications} new
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      New membership requires physical card
                    </p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      Low stock alert: Team Jersey
                    </p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-sm text-blue-600 hover:text-blue-700">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold p-4">
                      {user?.firstName?.charAt(0).toUpperCase() || "U"}
                      {user?.lastName?.charAt(0).toUpperCase() || ""}
                    </span>
                  </div>
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="pb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold p-4">
                      {user?.firstName?.charAt(0).toUpperCase() || "U"}
                      {user?.lastName?.charAt(0).toUpperCase() || ""}
                    </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user?.firstName || "User"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user?.email || "user@example.com"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link href={'/settings'} className="flex flex-row justify-between">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
