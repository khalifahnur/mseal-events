"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Calendar, MapPin, Clock, Ticket, Users, VoteIcon as Vs, Trophy, Star } from "lucide-react"
import { useCreateEvent } from "@/hooks/eventHook/eventHook"
import Image from "next/image"
import teamLogoUrl from "./teamLogo"

interface EventFormProps {
  onSuccess?: () => void
}

// const toast = {
//   error: (message: string) => console.error("Toast Error:", message),
//   success: (message: string) => console.log("Toast Success:", message),
// }

export function EventForm({ onSuccess }: EventFormProps) {
  const { mutate: createEvent, isPending } = useCreateEvent()

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
  })

  const [selectedTeams, setSelectedTeams] = useState({
    homeTeam: "",
    awayTeam: "",
  })

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ""
    const [year, month, day] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return ""
    const [day, month, year] = dateString.split("/")
    return `${year}-${month}-${day}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "date") {
      const formattedValue = formatDateForDisplay(value)
      setFormData({
        ...formData,
        [name]: formattedValue,
      })
    } else {
      setFormData({
        ...formData,
        [name]: name === "ticketPrice" || name === "availableTickets" ? Number(value) : value,
      })
    }
  }

  const handleTeamSelect = (teamType: "home" | "away", teamName: string) => {
    const selectedTeam = teamLogoUrl.find((team) => team.team === teamName)

    const newSelectedTeams = {
      ...selectedTeams,
      [teamType === "home" ? "homeTeam" : "awayTeam"]: teamName,
    }

    setSelectedTeams(newSelectedTeams)

    setFormData({
      ...formData,
      [teamType === "home" ? "homeTeam" : "awayTeam"]: teamName,
      [teamType === "home" ? "homeLogoUrl" : "opponentLogoUrl"]: selectedTeam?.logoUrl || "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const dateForSubmission = formatDateForInput(formData.date)
    const eventDate = new Date(dateForSubmission)

    if (eventDate < new Date()) {
      window.alert("Event date must be in the future")
      return
    }

    if (formData.availableTickets <= 0) {
      window.alert("Available tickets must be greater than 0")
      return
    }

    if (!formData.homeTeam || !formData.awayTeam) {
      window.alert("Please select both home and away teams")
      return
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
          })
          setSelectedTeams({
            homeTeam: "",
            awayTeam: "",
          })
          window.alert("Event created successfully!")
          onSuccess?.()
        },
      },
    )
  }

  const availableAwayTeams = teamLogoUrl.filter((team) => team.team !== selectedTeams.homeTeam)
  const availableHomeTeams = teamLogoUrl.filter((team) => team.team !== selectedTeams.awayTeam)

  return (
    <div className="max-w-4xl mx-auto p-2">
      <Card>
        <CardHeader className="bg-gradient-to-r from-[#fae115] to-gray-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?key=1eqw3')] opacity-10"></div>
          <div className="relative z-10">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Trophy className="h-4 w-4" />
              </div>
              Create Football Match Event
            </CardTitle>
            <CardDescription className="text-emerald-100 text-lg mt-2">
              Set up an exciting match with professional team selection and ticketing
            </CardDescription>
          </div>
          <div className="absolute top-2 right-4 opacity-20">
            <Star className="h-6 w-6" />
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-4">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Team Selection</h3>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  {/* Home Team */}
                  <div className="space-y-2">
                    <Label htmlFor="homeTeam" className="text-base font-semibold text-gray-700">
                      Home Team
                    </Label>
                    <Select onValueChange={(value) => handleTeamSelect("home", value)}>
                      <SelectTrigger className="w-full h-6 border-2 border-gray-200 hover:border-emerald-300 transition-colors">
                        <SelectValue placeholder="Select home team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="overflow-y-auto max-h-[10rem]">
                          {availableHomeTeams.map((team) => (
                            <SelectItem key={team.id} value={team.team} className="py-3">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={team.logoUrl || "/placeholder.svg"}
                                  alt={team.team}
                                  width={24}
                                  height={24}
                                  className="rounded-full border border-gray-200"
                                  loading="lazy"
                                  unoptimized
                                />
                                <span className="font-medium">{team.team}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {formData.homeLogoUrl && formData.homeTeam && (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <Image
                          src={formData.homeLogoUrl || "/placeholder.svg"}
                          alt={formData.homeTeam}
                          width={24}
                          height={24}
                          className="rounded-full border-2 border-emerald-300"
                          loading="lazy"
                          unoptimized
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{formData.homeTeam}</p>
                          <span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                            HOME
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* VS Section */}
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full p-4 shadow-lg">
                      <Vs className="h-4 w-4" />
                    </div>
                    <span className="text-2xl font-bold text-gray-600 mt-3 tracking-wider">VS</span>
                  </div>

                  {/* Away Team */}
                  <div className="space-y-2">
                    <Label htmlFor="awayTeam" className="text-base font-semibold text-gray-700">
                      Away Team
                    </Label>
                    <Select onValueChange={(value) => handleTeamSelect("away", value)}>
                      <SelectTrigger className="w-full h-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                        <SelectValue placeholder="Select away team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="overflow-y-auto max-h-[10rem]">
                          {availableAwayTeams.map((team) => (
                            <SelectItem key={team.id} value={team.team} className="py-3">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={team.logoUrl || "/placeholder.svg"}
                                  alt={team.team}
                                  width={24}
                                  height={24}
                                  className="rounded-full border border-gray-200"
                                  loading="lazy"
                                  unoptimized
                                />
                                <span className="font-medium">{team.team}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {formData.opponentLogoUrl && formData.awayTeam && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Image
                          src={formData.opponentLogoUrl || "/placeholder.svg"}
                          alt={formData.awayTeam}
                          width={24}
                          height={24}
                          className="rounded-full border-2 border-blue-300"
                          loading="lazy"
                          unoptimized
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{formData.awayTeam}</p>
                          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            AWAY
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Match Details</h3>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="venue" className="flex items-center gap-2 text-base font-semibold text-gray-700">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Venue
                    </Label>
                    <Input
                      id="venue"
                      name="venue"
                      placeholder="e.g., National Stadium"
                      value={formData.venue}
                      onChange={handleChange}
                      className="h-12 border-2 border-gray-200 focus:border-blue-400 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="date" className="flex items-center gap-2 text-base font-semibold text-gray-700">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      Date
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formatDateForInput(formData.date)}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="h-12 border-2 border-gray-200 focus:border-blue-400 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="time" className="flex items-center gap-2 text-base font-semibold text-gray-700">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Time
                    </Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="h-12 border-2 border-gray-200 focus:border-blue-400 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                  <Ticket className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Ticket Information</h3>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="ticketPrice"
                      className="flex items-center gap-2 text-base font-semibold text-gray-700"
                    >
                      <Ticket className="h-4 w-4 text-purple-600" />
                      Ticket Price (KSh)
                    </Label>
                    <Input
                      id="ticketPrice"
                      name="ticketPrice"
                      type="number"
                      min="0"
                      value={formData.ticketPrice}
                      onChange={handleChange}
                      className="h-12 border-2 border-gray-200 focus:border-purple-400 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="availableTickets"
                      className="flex items-center gap-2 text-base font-semibold text-gray-700"
                    >
                      <Users className="h-4 w-4 text-purple-600" />
                      Available Tickets
                    </Label>
                    <Input
                      id="availableTickets"
                      name="availableTickets"
                      type="number"
                      min="1"
                      value={formData.availableTickets}
                      onChange={handleChange}
                      className="h-12 border-2 border-gray-200 focus:border-purple-400 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-center items-center border-t bg-gray-50 p-8">
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 px-8 text-base font-semibold bg-gradient-to-r from-[#fae115] to-gray-700 hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Event...
                </>
              ) : (
                <>
                  Create Match Event
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
