"use client"

import { useState } from "react"
import { EventForm } from "@/components/event/event-form"
import { EventsTable } from "@/components/event/events-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { fetchEvents } from "@/lib/api"
import Loader from "../Loader"
import { EventData } from "../../../types/event"

export function EventsSection() {
  const [showAddForm, setShowAddForm] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["allEvents"],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5,
    //cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loader />;

  const totalEvents = data?.events.length
  const totalTickets = data?.events.reduce((acc:number, event:EventData) => acc + event.totalTickets, 0)
  const totalRevenue = data?.events.reduce((acc:number, event:EventData) => acc + event.ticketPrice * event.totalTickets, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Events Management</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? "View Events" : "Add New Event"}</Button>
      </div>

      {!showAddForm && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTickets.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {showAddForm ? (
        <EventForm
        />
      ) : (
        <EventsTable events={data?.events} />
      )}
    </div>
  )
}
