"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useCreateEvent } from "@/hooks/eventHook/eventHook";
import { toast } from "sonner";

interface EventFormProps {
  onSuccess?: () => void;
}

export function EventForm({ onSuccess }: EventFormProps) {
  const { mutate: createEvent, isPending } = useCreateEvent();

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
    ticketPrice: 0,
    availableTickets: 0,
  });

  // Convert yyyy-mm-dd to dd/mm/yyyy
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Convert dd/mm/yyyy to yyyy-mm-dd
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "date") {
      // For date input, we need to handle the format conversion
      const formattedValue = formatDateForDisplay(value);
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]:
          name === "ticketPrice" || name === "availableTickets"
            ? Number(value)
            : value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert date back to yyyy-mm-dd format before submitting
    const dateForSubmission = formatDateForInput(formData.date);
    const eventDate = new Date(dateForSubmission);

    // Validate date is in the future
    if (eventDate < new Date()) {
      toast.error("Event date must be in the future");
      return;
    }

    // Validate available tickets
    if (formData.availableTickets <= 0) {
      toast.error("Available tickets must be greater than 0");
      return;
    }

    createEvent(
      {
        ...formData,
        date: dateForSubmission,
      },
      {
        onSuccess: () => {
          // Reset form after successful submission
          setFormData({
            name: "",
            date: "",
            time: "",
            venue: "",
            ticketPrice: 0,
            availableTickets: 0,
          });
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Event</CardTitle>
        <CardDescription>
          Create a new event with all the necessary details for ticket sales.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Mseal vs Gor Mahia"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                placeholder="e.g., National Stadium"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formatDateForInput(formData.date)}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticketPrice">Ticket Price (Ksh)</Label>
              <Input
                id="ticketPrice"
                name="ticketPrice"
                type="number"
                min="0"
                step="100" // Assuming prices are in whole shillings
                value={formData.ticketPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableTickets">Available Tickets</Label>
              <Input
                id="availableTickets"
                name="availableTickets"
                type="number"
                min="1"
                value={formData.availableTickets}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
