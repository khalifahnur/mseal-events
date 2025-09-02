"use client";

import { AuthProvider } from "@/components/auth/auth-context";
import { DashboardLayout } from "@/components/dashboard";

import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}
