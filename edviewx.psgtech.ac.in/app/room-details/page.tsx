"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, Calendar, Users, Home } from "lucide-react"
import axios from "axios"

export default function RoomDetailsPage() {
  const [roomInfo, setRoomInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const config = { headers: { Authorization: `Bearer ${token}` } }

    async function fetchRoomData() {
      try {
        const res = await axios.get("http://localhost:5000/api/room/my", config)
        setRoomInfo(res.data?.data || null)
      } catch (err) {
        console.error("Failed to fetch room info:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoomData()
  }, [])

  if (loading) return <p>Loading...</p>

  if (!roomInfo)
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-600 text-center">No room allocated.</p>
      </div>
    )

  const { accommodationInfo, roomFeatures, contactInfo, roomStatus } = roomInfo

  const roomDetails = [
    { label: "Block Name", value: accommodationInfo?.block, icon: Building },
    { label: "Floor", value: accommodationInfo?.floor, icon: MapPin },
    { label: "Room Number", value: accommodationInfo?.roomNumber || "N/A", icon: Building },
    { label: "Joining Date", value: accommodationInfo?.joiningDate ? new Date(accommodationInfo.joiningDate).toLocaleDateString("en-GB") : "N/A", icon: Calendar },
    { label: "Room Type", value: accommodationInfo?.roomType, icon: Users },
    { label: "Room Size", value: roomFeatures?.roomSize, icon: Home },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Room Details</h1>
        <p className="text-gray-600">
          View your hostel accommodation information and room specifications.
        </p>
      </div>

      {/* Room Details Card */}
      <Card className="border-0 glass-card mb-8 bg-gray-90">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Building className="w-6 h-6 text-blue-600" />
            Accommodation Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roomDetails.map((detail, index) => {
              const Icon = detail.icon
              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-600 font-medium">{detail.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">
                      {detail.value || "N/A"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Room Features */}
      <Card className="border-0 glass-card mb-8 bg-gray-90">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Room Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Occupancy</span>
              <Badge className="bg-blue-100 text-blue-800">
                {roomFeatures?.occupancy || 0}/{roomFeatures?.maxOccupancy || 0} Students
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Facilities</span>
              <span className="font-medium">
                {roomFeatures?.facilities?.length
                  ? roomFeatures.facilities.join(", ")
                  : "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Bathroom</span>
              <span className="font-medium">{roomFeatures?.bathroom || "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-0 glass-card mb-8 bg-gray-90">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Warden</span>
              <span className="font-medium">{contactInfo?.warden || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Assistant Warden</span>
              <span className="font-medium">{contactInfo?.assistantWarden || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Emergency Contact</span>
              <span className="font-medium">{contactInfo?.emergencyContact || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Office Hours</span>
              <span className="font-medium">{contactInfo?.officeHours || "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Status */}
      <Card className="border-0 glass-card bg-gray-90">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  roomStatus?.status === "Active" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="font-medium text-gray-900">Room Status</span>
            </div>
            <Badge
              className={`bg-${
                roomStatus?.status === "Active" ? "green" : "red"
              }-100 text-${roomStatus?.status === "Active" ? "green" : "red"}-800`}
            >
              {roomStatus?.status || "Inactive"}
            </Badge>
          </div>
          {roomStatus?.status === "Active" && (
            <p className="text-sm text-gray-600 mt-2">
              Your room allocation is confirmed and active. For any issues or
              maintenance requests, please contact the hostel office during
              working hours.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
