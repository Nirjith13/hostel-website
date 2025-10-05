"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, History, X } from "lucide-react"

interface MenuItem {
  _id: string
  name: string
  price: number
}

interface Order {
  _id: string
  item: MenuItem
  meal: string
  date: string
  count?: number
  qrCode?: string
}

export default function TokensPage() {
  const [activeTab, setActiveTab] = useState<"tokens" | "history">("tokens")
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedQR, setSelectedQR] = useState<string | null>(null)
  const [showAllActive, setShowAllActive] = useState(false)
  const [showAllExpired, setShowAllExpired] = useState(false)

  const today = new Date().toISOString().split("T")[0]

  const fetchOrders = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const { data } = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (Array.isArray(data)) setOrders(data)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const activeOrders = orders.filter((order) => order.date === today)
  const expiredOrders = orders.filter((order) => order.date !== today)

  return (
    <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-12 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          🍽️ Token Management
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-10">
        <Button
          variant={activeTab === "tokens" ? "default" : "outline"}
          onClick={() => setActiveTab("tokens")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeTab === "tokens"
              ? "bg-blue-600 text-white shadow-lg"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <QrCode className="w-4 h-4" />
          List of Tokens
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "outline"}
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeTab === "history"
              ? "bg-indigo-600 text-white shadow-lg"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <History className="w-4 h-4" />
          Order History
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-lg rounded-3xl p-10">
        {/* TOKENS TAB */}
        {activeTab === "tokens" && (
          <div className="space-y-10">
            {/* Active Tokens */}
            <div>
              <h2 className="text-xl font-semibold text-green-700 mb-4">
                Active Tokens
              </h2>
              {activeOrders.length === 0 ? (
                <p className="text-gray-500 italic">No active tokens today.</p>
              ) : (
                <>
                  <div className="grid sm:grid-cols-3 gap-5">
                    {(showAllActive ? [...activeOrders].reverse() : [...activeOrders].reverse().slice(0, 6)).map((order) => (
                      <div
                        key={order._id}
                        className="border rounded-xl p-5 flex justify-between items-center bg-green-50 hover:shadow-md transition-all"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {order.item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.meal} • {order.date}
                          </p>
                          <p className="text-sm text-blue-700 font-semibold">
                            Tokens: {order.count || 1}
                          </p>
                        </div>
                        <div>
                          {order.qrCode ? (
                            <Image
                              src={order.qrCode}
                              alt="QR"
                              width={70}
                              height={70}
                              className="cursor-pointer rounded-lg shadow-sm transition-transform hover:scale-105"
                              onClick={() => setSelectedQR(order.qrCode!)}
                            />
                          ) : (
                            <Badge className="bg-gray-300 text-gray-800">No QR</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {activeOrders.length > 6 && !showAllActive && (
                    <div className="flex justify-center mt-4">
                      <Button onClick={() => setShowAllActive(true)} className="bg-blue-500 hover:bg-blue-600 text-white">View More</Button>
                    </div>
                  )}
                  {activeOrders.length > 6 && showAllActive && (
                    <div className="flex justify-center mt-4">
                      <Button onClick={() => setShowAllActive(false)} className="bg-gray-400 hover:bg-gray-500 text-white">Show Less</Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Expired Tokens */}
            <div>
              <h2 className="text-xl font-semibold text-red-700 mb-4">
                Expired Tokens
              </h2>
              {expiredOrders.length === 0 ? (
                <p className="text-gray-500 italic">No expired tokens.</p>
              ) : (
                <>
                  <div className="grid sm:grid-cols-3 gap-5">
                    {(showAllExpired ? [...expiredOrders].reverse() : [...expiredOrders].reverse().slice(0, 6)).map((order) => (
                      <div
                        key={order._id}
                        className="border rounded-xl p-5 flex justify-between items-center bg-gray-50 hover:shadow-sm transition-all"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-700">
                            {order.item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {order.meal} • {order.date}
                          </p>
                          <p className="text-sm text-blue-700 font-semibold">
                            Tokens: {order.count || 1}
                          </p>
                        </div>
                        <Badge className="bg-gray-400 text-white">Expired</Badge>
                      </div>
                    ))}
                  </div>
                  {expiredOrders.length > 6 && !showAllExpired && (
                    <div className="flex justify-center mt-4">
                      <Button onClick={() => setShowAllExpired(true)} className="bg-blue-500 hover:bg-blue-600 text-white">View More</Button>
                    </div>
                  )}
                  {expiredOrders.length > 6 && showAllExpired && (
                    <div className="flex justify-center mt-4">
                      <Button onClick={() => setShowAllExpired(false)} className="bg-gray-400 hover:bg-gray-500 text-white">Show Less</Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div className="space-y-10">
            {/* Active Orders */}
            <div>
              <h2 className="text-xl font-semibold text-green-700 mb-4">
                Active Orders
              </h2>
              {activeOrders.length === 0 ? (
                <p className="text-gray-500 italic">No active orders today.</p>
              ) : (
                <div className="space-y-4">
                  {[...activeOrders].reverse().map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-xl p-5 flex justify-between items-center bg-green-50 hover:shadow-md transition-all"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {order.item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {order.meal} • {order.date}
                        </p>
                        <p className="text-sm text-blue-700 font-semibold">
                          Tokens: {order.count || 1}
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          Price: ₹{order.item.price}
                        </p>
                      </div>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                      
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expired Orders */}
            <div>
              <h2 className="text-xl font-semibold text-red-700 mb-4">
                Expired Orders
              </h2>
              {expiredOrders.length === 0 ? (
                <p className="text-gray-500 italic">No expired orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {[...expiredOrders].reverse().map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-xl p-5 flex justify-between items-center bg-gray-50 hover:shadow-sm transition-all"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-700">
                          {order.item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {order.meal} • {order.date}
                        </p>
                        <p className="text-sm text-blue-700 font-semibold">
                          Tokens: {order.count || 1}
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          Price: ₹{order.item.price}
                        </p>
                      </div>
                      <Badge className="bg-gray-500 text-white">Expired</Badge>
                     
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enlarged QR Modal */}
      {selectedQR && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={() => setSelectedQR(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 relative max-w-sm mx-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedQR(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            <Image
              src={selectedQR}
              alt="QR"
              width={300}
              height={300}
              className="rounded-lg mx-auto"
            />
            <p className="text-center mt-4 text-sm text-gray-600">
              Scan this QR to verify your token
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
