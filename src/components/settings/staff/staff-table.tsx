"use client"

import { useState } from "react"
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
import { ChevronLeft, ChevronRight, Edit, MoreHorizontal, Trash2, Eye, Key } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Staff {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  validationcode: string;
  verificationCodeExpiration: string;
}

interface StaffTableProps {
  staff: Staff[];
  // onDelete: (id: string) => void;
}

export function StaffTable({ staff }: StaffTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter staff based on search term
  const filteredItems = staff?.filter((member) => {
    const fullName = `${member.firstname} ${member.lastname}`.toLowerCase()
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <Input
            placeholder="Search staff by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead className="hidden lg:table-cell">Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell className="font-medium">
                      {member.firstname} {member.lastname}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phoneNumber}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(member.createdAt).toLocaleDateString()}
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
                            View details (Code: {member.validationcode})
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit staff
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="mr-2 h-4 w-4" />
                            Reset password
                          </DropdownMenuItem>
                          <DropdownMenuItem >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete staff
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No staff found. Try adjusting your search.
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
              {filteredItems.length} staff
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