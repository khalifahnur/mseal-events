"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ShoppingBag, CreditCard, Settings,ListOrdered } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      id: "events" as const,
      label: "Events",
      icon: Calendar,
      href: "/events",
    },
    {
      id: "merchandise" as const,
      label: "Store",
      icon: ShoppingBag,
      href: "/store",
    },
    {
      id: "order" as const,
      label: "Order",
      icon: ListOrdered,
      href: "/orders",

    },
    {
      id: "memberships" as const,
      label: "Members",
      icon: CreditCard,
      href: "/members",
    },
    {
      id: "settings" as const,
      label: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#ebebeb] backdrop-blur-md border-t border-gray-200/50 shadow-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around h-12 sm:h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative flex flex-col items-center justify-center min-w-0 px-2 py-1.5 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />
                )}
                
                <div className={`p-1.5 rounded-md transition-all duration-300 ${
                  isActive 
                    ? "bg-blue-50 shadow-sm" 
                    : "group-hover:bg-gray-50"
                }`}>
                  <Icon
                    className={`h-4 w-4 transition-all duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`}
                  />
                </div>
                
                <span
                  className={`text-xs font-medium transition-all duration-300 truncate max-w-full ${
                    isActive ? "font-semibold text-blue-600" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}