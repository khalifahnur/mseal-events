"use client"

import { useState } from "react"
import { MembershipsTable } from "@/components/membership/memberships-table"
import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// interface MembershipsSectionProps {
//   memberships: Membership[]
//   onAddMembership: (member: Omit<Membership, "id">) => void
//   onDeleteMembership: (id: string) => void
// }

export function MembershipsSection() {
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Membership Management</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "View Memberships" : "Add New Member"}
        </Button>
      </div>
{/* 
      {showAddForm ? (
        <MembershipForm
          onSubmit={(member) => {
            onAddMembership(member)
            setShowAddForm(false)
          }}
        />
      ) : ( */}
        <MembershipsTable />
      {/* )} */}
    </div>
  )
};
