"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useCreateMerchandise } from "@/hooks/merchHook/useMerchandise";
import { toast } from "sonner";

// Define interfaces for type safety
interface FormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

interface Errors {
  name?: string;
  price?: string;
  stock?: string;
  imageUrl?: string;
}

interface MerchandiseItem {
  id: string;
  item: string;
  cost: number;
  imgUrl: string;
}

export default function MerchandiseForm() {
  const createMerchandise = useCreateMerchandise();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "Jersey",
    imageUrl: "/placeholder.svg?height=200&width=200",
  });

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<MerchandiseItem | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const merchandiseData: MerchandiseItem[] = [
    { id: "1", item: "Home Jersey", cost: 3000, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045331/img4_csabmd.jpg" },
    { id: "2", item: "Away Jersey", cost: 3000, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045310/img15_a6g6fw.jpg" },
    { id: "3", item: "Third Jersey", cost: 3500, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045309/img176_y5fkob.jpg" },
    { id: "4", item: "Hoodie", cost: 6500, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045267/img67_yhmnai.jpg" },
    { id: "5", item: "Hat", cost: 1500, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045223/img101_p6s982.jpg" },
    { id: "6", item: "Half Puff Jacket", cost: 10000, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045268/img94_q8aj25.jpg" },
    { id: "7", item: "BOMBER JACKETS", cost: 8500, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045319/img85_uux2xf.jpg" },
    { id: "8", item: "Home Kit Shorts", cost: 2000, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045238/img232_xstjhl.jpg" },
    { id: "9", item: "Away Kit Shorts", cost: 2000, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045254/img230_mrwlmf.jpg" },
    { id: "10", item: "Third Kit Shorts", cost: 2200, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045254/img195_qndwcr.jpg" },
    { id: "11", item: "Pants", cost: 3500, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045225/img33_t6m8x8.jpg" },
    { id: "12", item: "Sleeveless", cost: 2500, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045224/img200_nvkpoj.jpg" },
    { id: "13", item: "Polo Shirt", cost: 3000, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045344/img210_r0jqvv.jpg" },
    { id: "14", item: "3/4 Pants", cost: 3200, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045280/img220_jhn4hn.jpg" },
    { id: "15", item: "Bags", cost: 2000, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045309/img42_iijovz.jpg" },
    { id: "16", item: "Drawstring Bags", cost: 1500, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045344/img51_xg5dyw.jpg" },
    { id: "17", item: "Cap", cost: 1200, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045319/img112_hwc25d.jpg" },
    { id: "18", item: "Beenie Hats", cost: 1300, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045287/img119_oogbgb.jpg" },
    { id: "19", item: "Crop Tops", cost: 2800, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045319/img124_mwbjuv.jpg" },
    { id: "20", item: "Duffle Bag", cost: 4500, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045299/img133_bzagx8.jpg" },
    { id: "21", item: "Half Jacket", cost: 10000, imgUrl: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1758045268/img94_q8aj25.jpg" },
  ];

  const filteredMerchandise = useMemo(() => {
    if (!formData.name.trim()) return [];
    return merchandiseData.filter((item) =>
      item.item.toLowerCase().includes(formData.name.toLowerCase())
    ).slice(0, 5);
  }, [formData.name]);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.name.trim()) newErrors.name = "Item name is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Image URL is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "name") {
      setShowPreview(value.length > 0);
      setSelectedPreviewItem(null);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreviewItemClick = (item: MerchandiseItem) => {
    setFormData((prev) => ({
      ...prev,
      name: item.item,
      price: item.cost,
      imageUrl: item.imgUrl,
      category: getCategoryFromItem(item.item),
    }));
    setSelectedPreviewItem(item);
    setShowPreview(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await createMerchandise.mutateAsync(formData);
      toast.success("Merchandise added successfully!");
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "Jersey",
        imageUrl: "/placeholder.svg?height=200&width=200",
      });
      setSelectedPreviewItem(null);
      setShowPreview(false);
      setErrors({});
    } catch (error) {
      console.error("Merchandise creation error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const getCategoryFromItem = (itemName: string): string => {
    const name = itemName.toLowerCase();
    if (name.includes("jersey")) return "Jersey";
    if (name.includes("jacket") || name.includes("jacket")) return "Jacket";
    if (name.includes("hoodie")) return "Hoodie";
    if (name.includes("hat") || name.includes("cap") || name.includes("beenie")) return "Hats";
    if (name.includes("shorts")) return "Shorts";
    if (name.includes("pants")) return "Pants";
    if (name.includes("bag")) return "Bags";
    if (name.includes("sleeveless")) return "Sleeveless";
    return "Other";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-5xl shadow-xl">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-3xl font-bold text-gray-900">Add New Merchandise</CardTitle>
          <CardDescription className="text-gray-600">Create and preview merchandise items with real-time suggestions.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Fields */}
              <div className="space-y-6">
                <div className="relative">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Item Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Start typing for suggestions..."
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.name}
                    </p>
                  )}
                  {showPreview && filteredMerchandise.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
                      {filteredMerchandise.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handlePreviewItemClick(item)}
                          className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <Image
                            src={item.imgUrl}
                            alt={item.item}
                            width={64}
                            height={64}
                            className="object-cover rounded-md mr-4"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{item.item}</p>
                            <p className="text-sm text-green-600 font-semibold">Ksh {item.cost.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jersey">Jersey</SelectItem>
                      <SelectItem value="Shorts">Shorts</SelectItem>
                      <SelectItem value="Hats">Hats</SelectItem>
                      <SelectItem value="Pants">Pants</SelectItem>
                      <SelectItem value="Hoodie">Hoodie</SelectItem>
                      <SelectItem value="Jacket">Jacket</SelectItem>
                      <SelectItem value="Sleeveless">Sleeveless</SelectItem>
                      <SelectItem value="Bags">Bags</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the merchandise in detail"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-sm font-semibold text-gray-700">Price (Ksh)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className={`mt-1 ${errors.price ? "border-red-500" : ""}`}
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {errors.price}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="stock" className="text-sm font-semibold text-gray-700">Stock Quantity</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      className={`mt-1 ${errors.stock ? "border-red-500" : ""}`}
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" /> {errors.stock}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageUrl" className="text-sm font-semibold text-gray-700">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    placeholder="Enter image URL"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className={`mt-1 ${errors.imageUrl ? "border-red-500" : ""}`}
                  />
                  {errors.imageUrl && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" /> {errors.imageUrl}
                    </p>
                  )}
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Item Preview</h3>
                  {selectedPreviewItem && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-700">
                        Auto-filled from: <strong>{selectedPreviewItem.item}</strong>
                      </span>
                    </div>
                  )}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={formData.imageUrl}
                        alt={formData.name || "Merchandise preview"}
                        width={300}
                        height={300}
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=200&width=200";
                        }}
                      />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-semibold text-gray-800 truncate">
                        {formData.name || "Item Name"}
                      </h4>
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        {formData.category}
                      </Badge>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {formData.description || "No description provided"}
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-bold text-green-600">
                          Ksh {formData.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          Stock: {formData.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t flex justify-end gap-4 pt-10">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
              onClick={() => {
                setFormData({
                  name: "",
                  description: "",
                  price: 0,
                  stock: 0,
                  category: "Jersey",
                  imageUrl: "/placeholder.svg?height=200&width=200",
                });
                setSelectedPreviewItem(null);
                setShowPreview(false);
                setErrors({});
              }}
            >
              Clear Form
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={createMerchandise.isPending}
            >
              {createMerchandise.isPending ? "Adding..." : "Add Merchandise"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
