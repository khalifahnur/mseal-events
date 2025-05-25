"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Merchandise } from "../../../types/merch";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function EditMerchDialog({
  isOpen,
  onClose,
  item,
  onEditItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: Merchandise;
  onEditItem: (updatedItem: Merchandise, itemId: string) => void;
}) {
  const [editedItem, setEditedItem] = useState<Merchandise>(item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditItem(editedItem, item._id || "");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Merchandise</DialogTitle>
          <DialogDescription>
            Make changes to the merchandise item here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-category" className="text-right">
              Category
            </Label>
            <Input
              id="edit-category"
              value={editedItem.category}
              onChange={(e) =>
                setEditedItem({ ...editedItem, category: e.target.value })
              }
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-description" className="text-right">
              Description
            </Label>
            <Input
              id="edit-description"
              value={editedItem.description}
              onChange={(e) =>
                setEditedItem({ ...editedItem, description: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-image" className="text-right">
              Image URL
            </Label>
            <Input
              id="edit-image"
              value={editedItem.imageUrl}
              onChange={(e) =>
                setEditedItem({ ...editedItem, imageUrl: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-price" className="text-right">
              Price
            </Label>
            <Input
              id="edit-price"
              type="number"
              value={editedItem.price}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  price: Number(e.target.value),
                })
              }
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-stock" className="text-right">
              Stock
            </Label>
            <Input
              id="edit-stock"
              type="number"
              value={editedItem.stock}
              onChange={(e) =>
                setEditedItem({
                  ...editedItem,
                  stock: Number(e.target.value),
                })
              }
              className="col-span-3"
              required
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
