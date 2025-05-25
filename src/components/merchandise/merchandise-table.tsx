"use client";

import { useEffect, useState } from "react";
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
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Image from "next/image";
import { useDeleteMerch, useEditMerch } from "@/hooks/merchHook/useMerchandise";
import { toast } from "@/hooks/use-toast";
import Loader from "../Loader";
import { Merchandise } from "../../../types/merch";
import EditMerchDialog from "./EditMerch";
import DeleteConfirmationDialog from "./DeleteMerch";
import PreviewMerchDialog from "./PreviewMerch";

interface MerchandiseTableProps {
  merchandise: Merchandise[];
}

export function MerchandiseTable({ merchandise }: MerchandiseTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [merchToEdit, setMerchToEdit] = useState<Merchandise | null>(null);
  const [merchToDelete, setMerchToDelete] = useState<Merchandise | null>(null);
  const [merchToPreview, setmerchToPreview] = useState<Merchandise | null>(
    null
  );
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const itemsPerPage = 5;

  const merchMutation = useEditMerch();
  const deleteMutation = useDeleteMerch();

  const handleMerchItem = (updatedItem: Merchandise, itemId: string) => {
    merchMutation.mutate({ updatedItem, itemId });
  };

  const handleDeleteItem = () => {
    if (merchToDelete) {
      deleteMutation.mutate({
        itemId: merchToDelete._id || "",
      });
    }
  };

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      toast({
        title: "Deleted!",
        description: "Merchandise deleted successfully.",
        variant: "default",
      });
      setDeleteDialogOpen(false);
      setMerchToDelete(null);
    }

    if (deleteMutation.isError && deleteMutation.error) {
      toast({
        title: "Error",
        description: deleteMutation.error.message || "An error occurred.",
        variant: "destructive",
      });
    }

    if (merchMutation.isSuccess) {
      toast({
        title: "Updated!",
        description: "Merchandise updated successfully.",
        variant: "default",
      });
      setEditDialogOpen(false);
      setMerchToEdit(null);
    }

    if (merchMutation.isError && merchMutation.error) {
      toast({
        title: "Error",
        description: merchMutation.error.message || "An error occurred.",
        variant: "destructive",
      });
    }
  }, [
    deleteMutation.isSuccess,
    deleteMutation.isError,
    deleteMutation.error,
    merchMutation.isSuccess,
    merchMutation.isError,
    merchMutation.error,
  ]);

  const handlePreviewClick = (item: Merchandise) => {
    setmerchToPreview(item);
    setPreviewDialogOpen(true);
  };

  const handleEditClick = (item: Merchandise) => {
    setMerchToEdit(item);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (item: Merchandise) => {
    setMerchToDelete(item);
    setDeleteDialogOpen(true);
  };

  const filteredItems = merchandise?.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const categories = Array.from(
    new Set(merchandise.map((item) => item.category))
  );

  if (merchMutation.isPending || deleteMutation.isPending) return <Loader />;
  if (merchMutation.isError || deleteMutation.isError)
    return <div>Error loading merchandise</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search merchandise..."
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
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Description
                </TableHead>
                <TableHead className="hidden lg:table-cell">Image</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.category}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs truncate">
                      {item.description}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Image
                        src={item.imageUrl || ""}
                        width={40}
                        height={40}
                        alt={item.name}
                        className="object-cover"
                      />
                    </TableCell>
                    <TableCell>Ksh {item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.stock}</TableCell>
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
                          <DropdownMenuItem
                            onClick={() => handlePreviewClick(item)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditClick(item)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit merchandise
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete merchandise
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No merchandise found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {merchToPreview && (
          <PreviewMerchDialog
            isOpen={previewDialogOpen}
            onClose={() => {
              setPreviewDialogOpen(false);
              setmerchToPreview(null);
            }}
            item={merchToPreview}
          />
        )}

        {merchToEdit && (
          <EditMerchDialog
            isOpen={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setMerchToEdit(null);
            }}
            item={merchToEdit}
            onEditItem={handleMerchItem}
          />
        )}

        <DeleteConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setMerchToDelete(null);
          }}
          onConfirm={handleDeleteItem}
          itemName={merchToDelete?.name}
        />

        {filteredItems.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
              {filteredItems.length} items
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
