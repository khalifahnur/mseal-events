"use client"

import type React from "react"
import { useState } from "react"
import type { Membership } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface MembershipFormProps {
  onSubmit: (member: Omit<Membership, "id">) => void
}

export function MembershipForm({ onSubmit }: MembershipFormProps) {
  const [formData, setFormData] = useState<Omit<Membership, "id">>({
    name: "",
    email: "",
    phone: "",
    type: "standard",
    joinDate: new Date().toISOString().split("T")[0],
    needsPhysicalCard: false,
    cardStatus: "pending",
    imageUrl: "/placeholder.svg?height=50&width=50",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      needsPhysicalCard: checked,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Member</CardTitle>
        <CardDescription>Create a new membership record.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., John Smith"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g., john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="e.g., +1234567890"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Membership Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value as "standard" | "premium" | "vip")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="needsPhysicalCard" className="block mb-2">
                Physical Membership Card
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="needsPhysicalCard"
                  checked={formData.needsPhysicalCard}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="needsPhysicalCard">{formData.needsPhysicalCard ? "Required" : "Not required"}</Label>
              </div>
            </div>
          </div>

          {formData.needsPhysicalCard && (
            <div className="space-y-2">
              <Label htmlFor="cardStatus">Card Status</Label>
              <Select
                value={formData.cardStatus}
                onValueChange={(value) =>
                  handleSelectChange("cardStatus", value as "pending" | "processing" | "shipped" | "delivered")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Add Member</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
