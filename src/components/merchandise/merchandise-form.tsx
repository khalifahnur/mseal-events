"use client"

import type React from "react"
import { useState } from "react"
import type { Merchandise } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateMerchandise } from "@/hooks/merchHook/useMerchandise"
import { toast } from "sonner"

interface MerchandiseFormProps {
  onSubmit: (item: Omit<Merchandise, "id">) => void
}



export function MerchandiseForm({ onSubmit }: MerchandiseFormProps) {
  const createMerchandise = useCreateMerchandise();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "Jersey",
    imageUrl: "/placeholder.svg?height=200&width=200",
  })

  const data = [
    {id:'1',item:'home jersey',cost:3000,imgUrl:'https://res.cloudinary.com/dfuh1q6ic/image/upload/v1745236825/ChatGPT_Image_Apr_10__2025__09_50_49_PM-removebg-preview_dkopaw.png'},
    {id:'2',item:'away jersey',cost:3000,imgUrl:'https://res.cloudinary.com/dfuh1q6ic/image/upload/v1745236825/Screenshot_from_2025-04-21_14-41-50-removebg-preview_gsaiiz.png'},
    {id:'3',item:'third jersey',cost:3500,imgUrl:'https://res.cloudinary.com/dfuh1q6ic/image/upload/v1745236825/Screenshot_from_2025-04-21_14-34-36-removebg-preview_b6psl8.png'},
    {id:'4',item:'hoodie',cost:6500,imgUrl:'https://res.cloudinary.com/dfuh1q6ic/image/upload/v1745236825/Screenshot_from_2025-04-21_12-48-15-removebg-preview_ws1bys.png'},
    {id:'5',item:'hat',cost:1500,imgUrl:'https://res.cloudinary.com/dfuh1q6ic/image/upload/v1745236825/Screenshot_from_2025-04-21_13-02-45-removebg-preview_1_gukb10.png'},
    {id:'6',item:'truck suit',cost:10000,imgUrl:'https://res.cloudinary.com/dfuh1q6ic/image/upload/v1745236825/Screenshot_from_2025-04-21_14-50-21-removebg-preview_ghyuoy.png'},
  ]


  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target
  //   setFormData({
  //     ...formData,
  //     [name]: name === "price" || name === "stock" ? Number(value) : value,
  //   })
  // }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
  
    let updatedForm = {
      ...formData,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }
  
    if (name === "name") {
      const match = data.find((item) =>
        value.toLowerCase().includes(item.item.toLowerCase())
      )
      if (match) {
        updatedForm = {
          ...updatedForm,
          price: match.cost,
          imageUrl: match.imgUrl,
        }
      }
    }
  
    setFormData(updatedForm)
  }
  

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    try {
      await createMerchandise.mutateAsync(formData);
    } catch (error) {
      console.error("Merchandise creation error:", error);
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Merchandise</CardTitle>
        <CardDescription>Create a new merchandise item for your store.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Team Jersey - Home"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hats">Hats</SelectItem>
                  <SelectItem value="Jersey">Jersey</SelectItem>
                  <SelectItem value="Tracksuits">Track suits</SelectItem>
                  <SelectItem value="Hoodie">Hoodie</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide details about the merchandise"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (Ksh)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              placeholder="URL to merchandise image"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Add Merchandise</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
