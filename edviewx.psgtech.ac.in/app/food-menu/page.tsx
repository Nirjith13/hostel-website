"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface MenuItem {
  id: string
  name: string
  price: number
  image: string
  category: "Vegetarian" | "Non-Vegetarian"
  defaultMeal: "breakfast" | "lunch" | "dinner"
  dailyStock: number
}


export default function FoodMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Each item state separately
  const [item1Selected, setItem1Selected] = useState<{ meal: string; date: string } | null>(null)
  const [item2Selected, setItem2Selected] = useState<{ meal: string; date: string } | null>(null)
  const [item3Selected, setItem3Selected] = useState<{ meal: string; date: string } | null>(null)
  const [item4Selected, setItem4Selected] = useState<{ meal: string; date: string } | null>(null)

  // Add count state for each item
  const [item1Count, setItem1Count] = useState<number>(1)
  const [item2Count, setItem2Count] = useState<number>(1)
  const [item3Count, setItem3Count] = useState<number>(1)
  const [item4Count, setItem4Count] = useState<number>(1)

  // Fetch menu
  const fetchMenu = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/food/daily-menu")
      setMenuItems(Array.isArray(data.items) ? data.items.slice(0, 4) : [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  const handleAdd = (itemIndex: number) => {
    const item = menuItems[itemIndex]
    if (!item) return

    const defaultSelection = { meal: item.defaultMeal, date: new Date().toISOString().split("T")[0] }

    switch (itemIndex) {
      case 0: setItem1Selected(defaultSelection); setItem1Count(1); break
      case 1: setItem2Selected(defaultSelection); setItem2Count(1); break
      case 2: setItem3Selected(defaultSelection); setItem3Count(1); break
      case 3: setItem4Selected(defaultSelection); setItem4Count(1); break
    }
  }

  const handleMealChange = (itemIndex: number, meal: string) => {
    switch (itemIndex) {
      case 0: setItem1Selected((prev) => prev && { ...prev, meal }); break
      case 1: setItem2Selected((prev) => prev && { ...prev, meal }); break
      case 2: setItem3Selected((prev) => prev && { ...prev, meal }); break
      case 3: setItem4Selected((prev) => prev && { ...prev, meal }); break
    }
  }

  const handleDateChange = (itemIndex: number, date: string) => {
    switch (itemIndex) {
      case 0: setItem1Selected((prev) => prev && { ...prev, date }); break
      case 1: setItem2Selected((prev) => prev && { ...prev, date }); break
      case 2: setItem3Selected((prev) => prev && { ...prev, date }); break
      case 3: setItem4Selected((prev) => prev && { ...prev, date }); break
    }
  }

  const handleBuy = async (itemIndex: number) => {
    const item = menuItems[itemIndex]
    const selection = [item1Selected, item2Selected, item3Selected, item4Selected][itemIndex]
    const count = [item1Count, item2Count, item3Count, item4Count][itemIndex]
    if (!item || !selection) return alert("Select meal and date first")

    const token = localStorage.getItem("token")
    if (!token) return alert("Please login first.")

    try {
      await axios.post(
        "http://localhost:5000/api/food/buy",
        { itemId: item.id, meal: selection.meal, date: selection.date, amount: item.price, count },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert("Order successful!")
      // reset selection and count
      switch (itemIndex) {
        case 0: setItem1Selected(null); setItem1Count(1); break
        case 1: setItem2Selected(null); setItem2Count(1); break
        case 2: setItem3Selected(null); setItem3Count(1); break
        case 3: setItem4Selected(null); setItem4Count(1); break
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to order")
    }
  }

  // Cancel selection
  const handleCancel = (itemIndex: number) => {
    switch (itemIndex) {
      case 0: setItem1Selected(null); setItem1Count(1); break
      case 1: setItem2Selected(null); setItem2Count(1); break
      case 2: setItem3Selected(null); setItem3Count(1); break
      case 3: setItem4Selected(null); setItem4Count(1); break
    }
  }

  const renderItem = (item: MenuItem, index: number, selected: { meal: string; date: string } | null) => {
    const count = [item1Count, item2Count, item3Count, item4Count][index]
    return (
      <Card key={item.id} className="border-0 glass-card overflow-hidden">
        <CardHeader className="pb-4">
          <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            <Badge
              className={`absolute top-3 right-3 ${
                item.category === "Vegetarian" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {item.category}
            </Badge>
          </div>
          <CardTitle className="text-lg font-bold text-center">{item.name}</CardTitle>
          <div className="text-center">
            <span className="text-2xl font-bold text-blue-600">₹{item.price}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!selected ? (
            <Button onClick={() => handleAdd(index)} className="w-full bg-blue-600 hover:bg-blue-700">Add</Button>
          ) : (
            <>
              <Select value={selected.date} onValueChange={(value) => handleDateChange(index, value)}>
                <SelectTrigger><SelectValue placeholder="Select Date" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={new Date().toISOString().split("T")[0]}>Today</SelectItem>
                  <SelectItem value={new Date(Date.now() + 86400000).toISOString().split("T")[0]}>Tomorrow</SelectItem>
                </SelectContent>
              </Select>

              <RadioGroup value={selected.meal} onValueChange={(value) => handleMealChange(index, value)}>
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <div key={meal + "-" + index} className="flex items-center space-x-2">
                    <RadioGroupItem value={meal} id={`${meal}-${index}`} />
                    <Label htmlFor={`${meal}-${index}`}>{meal}</Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Count increment/decrement */}
              <div className="flex items-center justify-between gap-2">
                <Button onClick={() => {
                  switch (index) {
                    case 0: setItem1Count((c) => Math.max(1, c - 1)); break
                    case 1: setItem2Count((c) => Math.max(1, c - 1)); break
                    case 2: setItem3Count((c) => Math.max(1, c - 1)); break
                    case 3: setItem4Count((c) => Math.max(1, c - 1)); break
                  }
                }} size="sm" variant="outline">-</Button>
                <span className="font-semibold">{count}</span>
                <Button onClick={() => {
                  switch (index) {
                    case 0: setItem1Count((c) => c + 1); break
                    case 1: setItem2Count((c) => c + 1); break
                    case 2: setItem3Count((c) => c + 1); break
                    case 3: setItem4Count((c) => c + 1); break
                  }
                }} size="sm" variant="outline">+</Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleBuy(index)} className="w-full bg-slate-800 hover:bg-slate-900">Buy</Button>
                <Button onClick={() => handleCancel(index)} className="w-full bg-red-500 hover:bg-red-600" variant="outline">Cancel</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  // ✅ Filter by category before displaying
  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory)

  return (
    <>
      {/* Category Filter Dropdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Vegetarian">Vegetarian</SelectItem>
            <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Food Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) =>
            renderItem(item, index, [item1Selected, item2Selected, item3Selected, item4Selected][index])
          )
        ) : (
          <p className="col-span-full text-center text-gray-500">No items found for this category.</p>
        )}
      </div>
    </>
  )
}
