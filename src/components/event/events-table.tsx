"use client";

import { useEffect, useState } from "react";
import type { Event } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Loader from "../Loader";
import { toast } from "@/hooks/use-toast";
import { useDeleteEvent, useEditEvent } from "@/hooks/eventHook/eventHook";

function EditItemDialog({
  isOpen,
  onClose,
  item,
  onEditItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: Event;
  onEditItem: (updatedItem: Event, itemId: string) => void;
}) {
  const [editedItem, setEditedItem] = useState<Event>(item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditItem(editedItem, item._id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Make changes to the event here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={editedItem.date}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, date: e.target.value })
                }
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
                value={editedItem.time}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, time: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Name
            </Label>
            <Input
              id="edit-name"
              value={editedItem.name}
              onChange={(e) =>
                setEditedItem({ ...editedItem, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-venue" className="text-right">
              Venue
            </Label>
            <Input
              id="edit-venue"
              value={editedItem.venue}
              onChange={(e) =>
                setEditedItem({ ...editedItem, venue: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-price" className="text-right">
              Ticket Price
            </Label>
            <Input
              id="edit-price"
              type="number"
              value={editedItem.ticketPrice}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  ticketPrice: Number(e.target.value),
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-tickets" className="text-right">
              Total Tickets
            </Label>
            <Input
              id="edit-tickets"
              type="number"
              value={editedItem.totalTickets}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  totalTickets: Number(e.target.value),
                })
              }
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string | undefined;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {itemName}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EventsTableProps {
  events: Event[];
}

export function EventsTable({ events }: EventsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const eventsPerPage = 5;

  const editMutation = useEditEvent();
  const deleteMutation = useDeleteEvent();

  const handleEditItem = (updatedItem: Event, itemId: string) => {
    editMutation.mutate({ updatedItem, itemId });
  };

  const handleDeleteItem = () => {
    if (eventToDelete) {
      deleteMutation.mutate({
        itemId: eventToDelete._id,
      });
    }
  };

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      toast({
        title: "Deleted!",
        description: "Event deleted successfully.",
        variant: "default",
      });
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }

    if (deleteMutation.isError && deleteMutation.error) {
      toast({
        title: "Error",
        description: deleteMutation.error.message || "An error occurred.",
        variant: "destructive",
      });
    }

    if (editMutation.isSuccess) {
      toast({
        title: "Updated!",
        description: "Event updated successfully.",
        variant: "default",
      });
      setEditDialogOpen(false);
      setEventToEdit(null);
    }

    if (editMutation.isError && editMutation.error) {
      toast({
        title: "Error",
        description: editMutation.error.message || "An error occurred.",
        variant: "destructive",
      });
    }
  }, [
    deleteMutation.isSuccess,
    deleteMutation.isError,
    deleteMutation.error,
    editMutation.isSuccess,
    editMutation.isError,
    editMutation.error,
  ]);

  const handleEditClick = (event: Event) => {
    setEventToEdit(event);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  // Filter events based on search term and filters
  const filteredEvents = events?.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents?.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil(filteredEvents?.length / eventsPerPage);

  // Get unique categories for filter
  const categories = Array.from(
    new Set(events?.map((event) => event.category))
  );

  const getStatus = (
    eventDateStr: string
  ): "completed" | "ongoing" | "upcoming" => {
    const today = new Date();
    const eventDate = new Date(eventDateStr);

    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const eventDateOnly = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );

    if (eventDateOnly.getTime() < todayDateOnly.getTime()) {
      return "completed";
    } else if (eventDateOnly.getTime() === todayDateOnly.getTime()) {
      return "ongoing";
    } else {
      return "upcoming";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "upcoming":
        return "outline";
      case "ongoing":
        return "default";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (editMutation.isPending || deleteMutation.isPending) return <Loader />;
  if (editMutation.isError || deleteMutation.isError)
    return <div>Error loading events</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead className="hidden md:table-cell">
                  Date & Time
                </TableHead>
                <TableHead className="hidden md:table-cell">Venue</TableHead>
                <TableHead className="hidden lg:table-cell">Price</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Available
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEvents?.length > 0 ? (
                currentEvents?.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(event.date).toLocaleDateString()} at{" "}
                      {event.time}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {event.venue}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      Ksh {event.ticketPrice}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {event.totalTickets.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(getStatus(event.date))}
                      >
                        {getStatus(event.date)}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => handleEditClick(event)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit event
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(event)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete event
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No events found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {eventToEdit && (
          <EditItemDialog
            isOpen={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setEventToEdit(null);
            }}
            item={eventToEdit}
            onEditItem={handleEditItem}
          />
        )}

        <DeleteConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setEventToDelete(null);
          }}
          onConfirm={handleDeleteItem}
          itemName={eventToDelete?.name}
        />

        {filteredEvents?.length > eventsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstEvent + 1} to{" "}
              {Math.min(indexOfLastEvent, filteredEvents.length)} of{" "}
              {filteredEvents?.length} events
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
  );
}