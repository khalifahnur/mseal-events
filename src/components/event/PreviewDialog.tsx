"use client"
import { useState } from "react"
import type { EventData } from "../../../types/event"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Calendar, Clock, MapPin, Ticket, Users, DollarSign } from "lucide-react"

export default function PreviewItemDialog({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean
  onClose: () => void
  item: EventData
}) {
  const [previewItem] = useState<EventData>(item)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-200">
        <div className="bg-gradient-to-r from-[#fae115] to-black text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Event Preview</DialogTitle>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              <span className="text-blue-100">{formatDate(previewItem.date)}</span>
            </div>
          </DialogHeader>
        </div>

        <div className="p-3 space-y-3">
          <Card className="border-2 border-gray-100">
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center space-y-3 flex-1">
                  <div className="relative">
                    <Image
                      src={previewItem.homeLogoUrl || "/placeholder.svg"}
                      alt={previewItem.homeTeam}
                      width={40}
                      height={40}
                      className="rounded-full border-4 border-blue-200 shadow-lg"
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-800">{previewItem.homeTeam}</h3>
                    <Badge variant="secondary" className="mt-1">
                      Home
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2 px-8">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                    VS
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{formatTime(previewItem.time)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-3 flex-1">
                  <div className="relative">
                    <Image
                      src={previewItem.opponentLogoUrl || "/placeholder.svg"}
                      alt={previewItem.awayTeam}
                      width={40}
                      height={40}
                      className="rounded-full border-4 border-red-200 shadow-lg"
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-800">{previewItem.awayTeam}</h3>
                    <Badge variant="outline" className="mt-1">
                      Away
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Venue</p>
                    <p className="font-semibold text-gray-800">{previewItem.venue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date</p>
                    <p className="font-semibold text-gray-800">{formatDate(previewItem.date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-yellow-50 to-[#fae115] border-yellow-200">
            <CardContent className="p-3">
              <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                <Ticket className="h-5 w-5 text-yellow-600" />
                Ticket Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Price per Ticket</p>
                    <p className="font-bold text-xl text-green-600">Ksh.{previewItem.ticketPrice}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Available Tickets</p>
                    <p className="font-bold text-xl text-purple-600">{previewItem.totalTickets.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
