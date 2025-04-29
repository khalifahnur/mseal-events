"use client";

import { useState } from "react";
import { TopNavigation } from "@/components/top-navigation";
import { EventsSection } from "@/components/event/events-section";
import { MerchandiseSection } from "@/components/merchandise/merchandise-section";
import { MembershipsSection } from "@/components/membership/memberships-section";
import { SettingsSection } from "@/components/settings-section";

export type Event = {
  id: string;
  name: string;
  description?: string;
  date: string;
  time: string;
  venue: string;
  ticketPrice: number;
  availableTickets: number;
  category?: string;
  status?: "upcoming" | "ongoing" | "completed";
  imageUrl?: string;
};

export type Merchandise = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
};

export type Membership = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "standard" | "premium" | "vip";
  joinDate: string;
  needsPhysicalCard: boolean;
  cardStatus: "pending" | "processing" | "shipped" | "delivered";
  imageUrl?: string;
};

export type Staff = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  department: string;
  joinDate: string;
  imageUrl?: string;
};

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<
    "events" | "merchandise" | "memberships" | "settings"
  >("events");

  const [memberships, setMemberships] = useState<Membership[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1234567890",
      type: "premium",
      joinDate: "2025-01-15",
      needsPhysicalCard: true,
      cardStatus: "pending",
      imageUrl: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1987654321",
      type: "vip",
      joinDate: "2025-02-20",
      needsPhysicalCard: true,
      cardStatus: "processing",
      imageUrl: "/placeholder.svg?height=50&width=50",
    },
  ]);

  const [staff, setStaff] = useState<Staff[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      department: "Management",
      joinDate: "2024-01-01",
      imageUrl: "/placeholder.svg?height=50&width=50",
    },
  ]);

  const handleAddMembership = (member: Omit<Membership, "id">) => {
    const newMember = {
      ...member,
      id: Math.random().toString(36).substring(2, 9),
    };
    setMemberships([...memberships, newMember]);

    // Alert for new membership requiring physical card
    if (member.needsPhysicalCard) {
      alert(
        `New membership created for ${member.name} that requires a physical card!`
      );
    }
  };

  const handleDeleteMembership = (id: string) => {
    setMemberships(memberships.filter((member) => member.id !== id));
  };

  const handleAddStaff = (staffMember: Omit<Staff, "id">) => {
    const newStaff = {
      ...staffMember,
      id: Math.random().toString(36).substring(2, 9),
    };
    setStaff([...staff, newStaff]);
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((member) => member.id !== id));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="flex-1 container mx-auto p-4 md:p-6">
        {activeSection === "events" && <EventsSection />}

        {activeSection === "merchandise" && <MerchandiseSection />}

        {activeSection === "memberships" && (
          <MembershipsSection
            memberships={memberships}
            onAddMembership={handleAddMembership}
            onDeleteMembership={handleDeleteMembership}
          />
        )}

        {activeSection === "settings" && (
          <SettingsSection
            staff={staff}
            onAddStaff={handleAddStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        )}
      </main>
    </div>
  );
}
