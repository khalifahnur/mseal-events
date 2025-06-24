"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffSignupTab from "./settings/staff/staff-form";
import { useQuery } from "@tanstack/react-query";
import { fetchAllStaff } from "@/lib/api";
import Loader from "./Loader";
import Account from "./settings/account/account";
import { StaffTable } from "./settings/staff/staff-table";



export function SettingsSection() {
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["allStaff"],
    queryFn: fetchAllStaff,
    staleTime: 1000 * 60 * 5,
    //cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Settings</h2>

      <Tabs defaultValue="staff">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="staff">Staff Accounts</TabsTrigger>
          <TabsTrigger value="account">My Account</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Staff Management</h3>
            <Button onClick={() => setShowAddStaffForm(!showAddStaffForm)}>
              {showAddStaffForm ? "View Staff" : "Add Staff Member"}
            </Button>
          </div>

          {showAddStaffForm ? (
            <StaffSignupTab />
          ) : (
            <StaffTable staff={data}  />
          )}
        </TabsContent>

        <TabsContent value="account" className="space-y-4 pt-4">
          <Account />
        </TabsContent>

        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-medium">System Preferences</h4>
                <p className="text-sm text-muted-foreground">
                  Configure system-wide settings
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Email Templates</h4>
                <p className="text-sm text-muted-foreground">
                  Customize email notifications sent to users
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Backup & Export</h4>
                <p className="text-sm text-muted-foreground">
                  Manage data backups and exports
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
