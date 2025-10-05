"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


// Helper to format 24-hour time to 12-hour format with AM/PM
function formatTime12(time?: string) {
  if (!time) return "";
  const [h, m] = time.split(":");
  let hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${m} ${ampm}`;
}

// Helper to format yyyy-mm-dd to dd MMM yyyy
function formatDate(date: string) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

interface Leave {
  _id: string
  fromDate: string
  fromTime?: string
  toDate: string
  toTime?: string
  noOfDays?: string
  reason: string
  status: string
}

export default function LeavePage() {
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [fromTime, setFromTime] = useState("")
  const [toTime, setToTime] = useState("")
  const [noOfDays, setNoOfDays] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchLeaves = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const { data } = await axios.get("http://localhost:5000/api/leave/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) setLeaves(data.leaves)
    } catch (err) {
      console.error("Failed to fetch leaves:", err)
    }
  }

  useEffect(() => {
    fetchLeaves()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem("token")
    try {
      await axios.post(
        "http://localhost:5000/api/leave",
  { fromDate, fromTime, toDate, toTime, noOfDays, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setFromDate("")
      setFromTime("")
      setToDate("")
      setToTime("")
      setNoOfDays("")
      setReason("")
      fetchLeaves()
    } catch (err) {
      alert("Failed to post leave")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Student Leave Entry</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Apply for Leave</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">From Date</label>
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} required className="border rounded px-3 py-2 w-full" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">To Date</label>
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} required className="border rounded px-3 py-2 w-full" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">No. of Days</label>
                <input type="number" min="1" value={noOfDays} onChange={e => setNoOfDays(e.target.value)} required className="border rounded px-3 py-2 w-full" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">From Time</label>
                <input type="time" value={fromTime} onChange={e => setFromTime(e.target.value)} required className="border rounded px-3 py-2 w-full" />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">To Time</label>
                <input type="time" value={toTime} onChange={e => setToTime(e.target.value)} required className="border rounded px-3 py-2 w-full" />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Reason</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} required className="border rounded px-3 py-2 w-full" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? "Submitting..." : "Submit Leave Request"}
            </Button>
          </form>
        </CardContent>
      </Card>

  <h2 className="text-xl font-bold mb-4">Posted Leave</h2>
      <div className="space-y-4">
        {leaves.length === 0 ? (
          <p className="text-gray-500">No leave requests yet.</p>
        ) : (
          leaves.map(leave => (
            <Card key={leave._id} className="border-0 glass-card bg-gray-100">
              <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
                <div>
                  <div className="font-semibold">
                    {formatDate(leave.fromDate)}{leave.fromTime ? ` (${formatTime12(leave.fromTime)})` : ""} to {formatDate(leave.toDate)}{leave.toTime ? ` (${formatTime12(leave.toTime)})` : ""}
                  </div>
                  <div className="text-gray-700">No. of days: {leave.noOfDays ? leave.noOfDays : ""}</div>
                  <div className="text-gray-700">Reason: {leave.reason}</div>
                </div>
                <Badge className={
                  leave.status === "accepted"
                    ? "bg-green-500 text-white"
                    : leave.status === "rejected"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-400 text-black"
                }>
                  {leave.status === "pending" ? "In Progress" : leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
