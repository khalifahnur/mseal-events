"use client"

import { useState } from "react"
import type { Membership } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Edit, MoreHorizontal, Trash2, Eye, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MembershipsTableProps {
  memberships: Membership[]
  onDelete: (id: string) => void
}

export function MembershipsTable({ memberships, onDelete }: MembershipsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [cardFilter, setCardFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter memberships based on search term and filters
  const filteredItems = memberships.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || member.type === typeFilter
    const matchesCard =
      cardFilter === "all" ||
      (cardFilter === "needs-card" && member.needsPhysicalCard) ||
      (cardFilter === "no-card" && !member.needsPhysicalCard)

    return matchesSearch && matchesType && matchesCard
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "standard":
        return "outline"
      case "premium":
        return "default"
      case "vip":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getCardStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline"
      case "processing":
        return "default"
      case "shipped":
        return "secondary"
      case "delivered":
        return "success"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cardFilter} onValueChange={setCardFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Card Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="needs-card">Needs Card</SelectItem>
                <SelectItem value="no-card">No Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Join Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Card Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(member.type)}>
                        {member.type.charAt(0).toUpperCase() + member.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.needsPhysicalCard ? (
                        <Badge variant={getCardStatusBadgeVariant(member.cardStatus)}>
                          {member.cardStatus.charAt(0).toUpperCase() + member.cardStatus.slice(1)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit member
                          </DropdownMenuItem>
                          {member.needsPhysicalCard && (
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Update card status
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onDelete(member.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No members found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredItems.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
              {filteredItems.length} members
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
