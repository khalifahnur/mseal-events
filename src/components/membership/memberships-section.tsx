"use client"

import { useState } from "react"
import type { Membership } from "@/components/dashboard"
import { MembershipForm } from "@/components/membership/membership-form"
import { MembershipsTable } from "@/components/membership/memberships-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MembershipsSectionProps {
  memberships: Membership[]
  onAddMembership: (member: Omit<Membership, "id">) => void
  onDeleteMembership: (id: string) => void
}

export function MembershipsSection({ memberships, onAddMembership, onDeleteMembership }: MembershipsSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)

  const totalMembers = memberships.length
  const pendingCards = memberships.filter((m) => m.needsPhysicalCard && m.cardStatus === "pending").length
  const premiumMembers = memberships.filter((m) => m.type === "premium" || m.type === "vip").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Membership Management</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "View Memberships" : "Add New Member"}
        </Button>
      </div>

      {!showAddForm && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCards}</div>
              {pendingCards > 0 && <p className="text-sm text-red-500 mt-1">Requires attention</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Premium Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{premiumMembers}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {showAddForm ? (
        <MembershipForm
          onSubmit={(member) => {
            onAddMembership(member)
            setShowAddForm(false)
          }}
        />
      ) : (
        <MembershipsTable memberships={memberships} onDelete={onDeleteMembership} />
      )}
    </div>
  )
}
