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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Users,
  Vote as Vs,
} from "lucide-react";
import { useCreateEvent } from "@/hooks/eventHook/eventHook";
import { toast } from "sonner";
import Image from "next/image";
import teamLogoUrl from "./teamLogo";

interface EventFormProps {
  onSuccess?: () => void;
}

export function EventForm({ onSuccess }: EventFormProps) {
  const { mutate: createEvent, isPending } = useCreateEvent();

  const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",
    date: "",
    time: "",
    venue: "",
    ticketPrice: 0,
    availableTickets: 0,
    homeLogoUrl: "",
    opponentLogoUrl: "",
  });

  const [selectedTeams, setSelectedTeams] = useState({
    homeTeam: "",
    awayTeam: "",
  });

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "date") {
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

  const handleTeamSelect = (teamType: "home" | "away", teamName: string) => {
    const selectedTeam = teamLogoUrl.find((team) => team.team === teamName);

    const newSelectedTeams = {
      ...selectedTeams,
      [teamType === "home" ? "homeTeam" : "awayTeam"]: teamName,
    };

    setSelectedTeams(newSelectedTeams);

    setFormData({
      ...formData,
      [teamType === "home" ? "homeTeam" : "awayTeam"]: teamName,
      [teamType === "home" ? "homeLogoUrl" : "opponentLogoUrl"]: selectedTeam?.logoUrl || "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dateForSubmission = formatDateForInput(formData.date);
    const eventDate = new Date(dateForSubmission);

    if (eventDate < new Date()) {
      toast.error("Event date must be in the future");
      return;
    }

    if (formData.availableTickets <= 0) {
      toast.error("Available tickets must be greater than 0");
      return;
    }

    if (!formData.homeTeam || !formData.awayTeam) {
      toast.error("Please select both home and away teams");
      return;
    }

    createEvent(
      {
        ...formData,
        date: dateForSubmission,
      },
      {
        onSuccess: () => {
          setFormData({
            homeTeam: "",
            awayTeam: "",
            date: "",
            time: "",
            venue: "",
            ticketPrice: 0,
            availableTickets: 0,
            homeLogoUrl: "",
            opponentLogoUrl: "",
          });
          setSelectedTeams({
            homeTeam: "",
            awayTeam: "",
          });
          toast.success("Event created successfully!");
          onSuccess?.();
        },
      }
    );
  };

  const availableAwayTeams = teamLogoUrl.filter(
    (team) => team.team !== selectedTeams.homeTeam
  );
  const availableHomeTeams = teamLogoUrl.filter(
    (team) => team.team !== selectedTeams.awayTeam
  );

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-[#fae115] to-black text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-black flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Create Football Match Event
        </CardTitle>
        <CardDescription className="font-bold text-black">
          Set up a new match with team selection and ticket details
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Team Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Teams</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="homeTeam">Home Team</Label>
                <Select onValueChange={(value) => handleTeamSelect("home", value)}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select home team" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableHomeTeams.map((team) => (
                      <SelectItem key={team.id} value={team.team}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={team.logoUrl || "/placeholder.svg"}
                            alt={team.team}
                            width={20}
                            height={20}
                            className="rounded-full"
                            loading="lazy"
                            unoptimized 
                          />
                          {team.team}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.homeLogoUrl && formData.homeTeam && (
                  <div className="flex items-center gap-2 mt-2">
                    <Image
                      src={formData.homeLogoUrl}
                      alt={formData.homeTeam}
                      width={40}
                      height={40}
                      className="rounded-full"
                      loading="lazy"
                      unoptimized 
                    />
                    <span className="text-sm text-green-600">HOME</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="bg-gradient-to-r from-[#fae115] to-black text-white rounded-full p-3">
                  <Vs className="h-6 w-6" />
                </div>
                <span className="text-lg font-bold text-gray-500 mt-2">VS</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="awayTeam">Away Team</Label>
                <Select onValueChange={(value) => handleTeamSelect("away", value)}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select away team" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAwayTeams.map((team) => (
                      <SelectItem key={team.id} value={team.team}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={team.logoUrl || "/placeholder.svg"}
                            alt={team.team}
                            width={20}
                            height={20}
                            className="rounded-full"
                            loading="lazy"
                            unoptimized 
                          />
                          {team.team}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.opponentLogoUrl && formData.awayTeam && (
                  <div className="flex items-center gap-2 mt-2">
                    <Image
                      src={formData.opponentLogoUrl}
                      alt={formData.awayTeam}
                      width={40}
                      height={40}
                      className="rounded-full"
                      loading="lazy"
                      unoptimized 
                    />
                    <span className="text-sm text-blue-600">AWAY</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Match Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Venue
                </Label>
                <Input
                  id="venue"
                  name="venue"
                  placeholder="e.g., National Stadium"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </Label>
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
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time
                </Label>
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
          </div>

          {/* Ticket Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ticket Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticketPrice" className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  Ticket Price (KSh)
                </Label>
                <Input
                  id="ticketPrice"
                  name="ticketPrice"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableTickets" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Available Tickets
                </Label>
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
              "Create Match Event"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}