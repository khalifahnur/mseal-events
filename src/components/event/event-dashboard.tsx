"use client"

import { useState } from "react"
import { EventForm } from "@/components/event/event-form"
import { EventsTable } from "@/components/event/events-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type Event = {
  id: string
  name: string
  description: string
  date: string
  time: string
  venue: string
  ticketPrice: number
  availableTickets: number
  category: string
  status: "upcoming" | "ongoing" | "completed"
  imageUrl?: string
}

export function EventDashboard() {
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

  const totalEvents = events.length
  const totalTickets = events.reduce((acc, event) => acc + event.availableTickets, 0)
  const totalRevenue = events.reduce((acc, event) => acc + event.ticketPrice * event.availableTickets, 0)

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Event Management Dashboard</h1>
          <DashboardStats totalEvents={totalEvents} totalTickets={totalTickets} totalRevenue={totalRevenue} />

          <Tabs defaultValue="events" className="mt-6">
            <TabsList>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="add">Add Event</TabsTrigger>
            </TabsList>
            <TabsContent value="events" className="p-0">
              <EventsTable events={events} onDelete={handleDeleteEvent} />
            </TabsContent>
            <TabsContent value="add" className="p-0">
              <EventForm onSubmit={handleAddEvent} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
