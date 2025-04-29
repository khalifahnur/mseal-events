"use client"

import { useState } from "react"
import { TopNavigation } from "@/components/top-navigation"
import { EventsSection } from "@/components/event/events-section"
import { MerchandiseSection } from "@/components/merchandise/merchandise-section"
import { MembershipsSection } from "@/components/membership/memberships-section"
import { SettingsSection } from "@/components/settings-section"

export type Event = {
  id: string
  name: string
  description?: string
  date: string
  time: string
  venue: string
  ticketPrice: number
  availableTickets: number
  category?: string
  status?: "upcoming" | "ongoing" | "completed"
  imageUrl?: string
}

export type Merchandise = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl?: string
}

export type Membership = {
  id: string
  name: string
  email: string
  phone: string
  type: "standard" | "premium" | "vip"
  joinDate: string
  needsPhysicalCard: boolean
  cardStatus: "pending" | "processing" | "shipped" | "delivered"
  imageUrl?: string
}

export type Staff = {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "staff"
  department: string
  joinDate: string
  imageUrl?: string
}

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<"events" | "merchandise" | "memberships" | "settings">("events")

  // Sample data
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Mseal vs Gor Mahia",
      description: "Premier League match between Mseal and Gor Mahia",
      date: "2025-05-15",
      time: "15:00",
      venue: "National Stadium",
      ticketPrice: 50,
      availableTickets: 5000,
      category: "Football",
      status: "upcoming",
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "2",
      name: "Sharks vs Lions",
      description: "Basketball championship finals",
      date: "2025-05-20",
      time: "18:30",
      venue: "Indoor Arena",
      ticketPrice: 75,
      availableTickets: 2000,
      category: "Basketball",
      status: "upcoming",
      imageUrl: "/placeholder.svg?height=200&width=400",
    },
  ])

  const [merchandise, setMerchandise] = useState<Merchandise[]>([
    {
      id: "1",
      name: "Team Jersey - Home",
      description: "Official home jersey for the 2025 season",
      price: 89.99,
      stock: 250,
      category: "Apparel",
      imageUrl: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "2",
      name: "Team Scarf",
      description: "Official team scarf with embroidered logo",
      price: 24.99,
      stock: 500,
      category: "Accessories",
      imageUrl: "/placeholder.svg?height=200&width=200",
    },
  ])

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
  ])

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
  ])

  // Event handlers
  const handleAddEvent = (event: Omit<Event, "id">) => {
    const newEvent = {
      ...event,
      id: Math.random().toString(36).substring(2, 9),
    }
    setEvents([...events, newEvent])
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  const handleAddMerchandise = (item: Omit<Merchandise, "id">) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
    }
    setMerchandise([...merchandise, newItem])
  }

  const handleDeleteMerchandise = (id: string) => {
    setMerchandise(merchandise.filter((item) => item.id !== id))
  }

  const handleAddMembership = (member: Omit<Membership, "id">) => {
    const newMember = {
      ...member,
      id: Math.random().toString(36).substring(2, 9),
    }
    setMemberships([...memberships, newMember])

    // Alert for new membership requiring physical card
    if (member.needsPhysicalCard) {
      alert(`New membership created for ${member.name} that requires a physical card!`)
    }
  }

  const handleDeleteMembership = (id: string) => {
    setMemberships(memberships.filter((member) => member.id !== id))
  }

  const handleAddStaff = (staffMember: Omit<Staff, "id">) => {
    const newStaff = {
      ...staffMember,
      id: Math.random().toString(36).substring(2, 9),
    }
    setStaff([...staff, newStaff])
  }

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((member) => member.id !== id))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="flex-1 container mx-auto p-4 md:p-6">
        {activeSection === "events" && (
          <EventsSection events={events} onAddEvent={handleAddEvent} onDeleteEvent={handleDeleteEvent} />
        )}

        {activeSection === "merchandise" && (
          <MerchandiseSection
            merchandise={merchandise}
            onAddMerchandise={handleAddMerchandise}
            onDeleteMerchandise={handleDeleteMerchandise}
          />
        )}

        {activeSection === "memberships" && (
          <MembershipsSection
            memberships={memberships}
            onAddMembership={handleAddMembership}
            onDeleteMembership={handleDeleteMembership}
          />
        )}

        {activeSection === "settings" && (
          <SettingsSection staff={staff} onAddStaff={handleAddStaff} onDeleteStaff={handleDeleteStaff} />
        )}
      </main>
    </div>
  )
}
