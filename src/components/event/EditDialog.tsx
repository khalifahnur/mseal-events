"use client"
import { useState } from "react";
import { EventData } from "../../../types/event";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";


export default function EditItemDialog({
  isOpen,
  onClose,
  item,
  onEditItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: EventData;
  onEditItem: (updatedItem: EventData, itemId: string) => void;
}) {
  const [editedItem, setEditedItem] = useState<EventData>(item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditItem(editedItem, item._id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Make changes to the event here. Click save when you&apos;re done.
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
            <Label htmlFor="homeTeam" className="text-right">
              Home Team
            </Label>
            <Input
              id="homeTeam"
              value={editedItem.homeTeam}
              onChange={(e) =>
                setEditedItem({ ...editedItem, homeTeam: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="awayTeam" className="text-right">
              Away Team
            </Label>
            <Input
              id="awayTeam"
              value={editedItem.awayTeam}
              onChange={(e) =>
                setEditedItem({ ...editedItem, awayTeam: e.target.value })
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