"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Merchandise } from "../../../types/merch";
import { useState } from "react";
import Image from "next/image";
import { Package, Tag, Archive, FileText, Star } from "lucide-react";

export default function PreviewMerchDialog({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: Merchandise;
}) {
  const [previewItem] = useState<Merchandise>(item);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "destructive" };
    if (stock < 10) return { label: "Low Stock", color: "secondary" };
    return { label: "In Stock", color: "default" };
  };

  const stockStatus = getStockStatus(previewItem.stock);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-black to-[#fae115] text-white p-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Merchandise Preview
            </DialogTitle>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Package className="h-4 w-4" />
              <span className="text-emerald-100">Product Details</span>
            </div>
          </DialogHeader>
        </div>

        <div className=" space-y-2 px-2">
          <Card className="border-2 border-gray-100">
            <CardContent className="p-1">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Image
                      src={
                        previewItem.imageUrl ||
                        "/placeholder.svg?height=200&width=200"
                      }
                      alt={previewItem.name}
                      width={100}
                      height={100}
                      className="rounded-lg border-4 border-gray-200 shadow-lg object-cover"
                      loading="lazy"
                      unoptimized
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        // disable-eslint@typescript-eslint/no-explicit-any
                        variant={stockStatus.color as any}
                        className="shadow-md"
                      >
                        {stockStatus.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 flex-row">
                  <div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {previewItem.name}
                      </h3>
                      <Badge variant="outline" className="mb-2">
                        {previewItem.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Star className="h-2 w-2 text-yellow-500 fill-current" />
                      <Star className="h-2 w-2 text-yellow-500 fill-current" />
                      <Star className="h-2 w-2 text-yellow-500 fill-current" />
                      <Star className="h-2 w-2 text-yellow-500 fill-current" />
                      <Star className="h-2 w-2 text-gray-300" />
                      <span className="text-sm text-gray-600 ml-2">
                        (4.0 rating)
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-700">
                        Price
                      </span>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      Ksh.{previewItem.price}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Tag className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Category
                    </p>
                    <p className="font-semibold text-gray-800">
                      {previewItem.category}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Archive className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Stock Available
                    </p>
                    <p className="font-semibold text-gray-800">
                      {previewItem.stock.toLocaleString()} units
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {previewItem.description && (
            <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
              <CardContent className="p-3">
                <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Product Description
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {previewItem.description}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gradient-to-r from-yellow-50 to-red-50 border-orange-200">
            <CardContent className="p-3">
              <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-600" />
                Product Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center bg-white rounded-lg shadow-sm">
                  <div className="text-xl font-bold text-orange-600">
                    Ksh.{previewItem.price}
                  </div>
                  <div className="text-sm text-gray-600">Unit Price</div>
                </div>
                <div className="text-center bg-white rounded-lg shadow-sm">
                  <div className="text-xl font-bold text-purple-600">
                    {previewItem.stock}
                  </div>
                  <div className="text-sm text-gray-600">In Stock</div>
                </div>
                <div className="text-center  bg-white rounded-lg shadow-sm">
                  <div className="text-xl font-bold text-blue-600">
                    Ksh.
                    {(previewItem.price * previewItem.stock).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
