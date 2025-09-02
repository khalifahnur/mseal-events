"use client";

import { EventsTable } from "@/components/event/events-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/api";
import Loader from "../Loader";
import { EventData } from "../../../types/event";
import {
  Calendar,
  Ticket,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import FloatingActionButton from "../FloatBtn";

export function EventsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["allEvents"],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loader />;

  const totalEvents = data?.events.length || 0;
  const totalTickets =
    data?.events.reduce(
      (acc: number, event: EventData) => acc + event.totalTickets,
      0
    ) || 0;
  const totalRevenue =
    data?.events.reduce(
      (acc: number, event: EventData) =>
        acc + event.ticketPrice * event.totalTickets,
      0
    ) || 0;

  const upcomingEvents =
    data?.events.filter((event: EventData) => new Date(event.date) > new Date())
      .length || 0;

  return (
    <div className="space-y-8 py-6">
      {/* Header Section */}

      <FloatingActionButton
        tooltip="Add Events"
        href='/events/add-events'
      />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Total Events
                </CardTitle>
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {totalEvents}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {upcomingEvents} upcoming
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                  Available Tickets
                </CardTitle>
                <Ticket className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-900 dark:text-green-100">
                {totalTickets.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Across all events
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Potential Revenue
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                Ksh {totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Maximum earnings
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Avg. Ticket Price
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
                Ksh{" "}
                {totalEvents > 0
                  ? Math.round(totalRevenue / totalTickets).toLocaleString()
                  : 0}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Per ticket
              </p>
            </CardContent>
          </Card>
        </div>

      <div>
       <EventsTable events={data?.events} />
      </div>
    </div>
  );
}
