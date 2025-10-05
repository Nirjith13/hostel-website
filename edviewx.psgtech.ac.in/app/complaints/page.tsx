"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const complaintTypes = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Internet",
  "Other"
]

export default function ComplaintsPage() {
  const [type, setType] = useState(complaintTypes[0])
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [complaints, setComplaints] = useState<any[]>([])

  const fetchComplaints = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const { data } = await axios.get("http://localhost:5000/api/complaint/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) setComplaints(data.complaints)
    } catch (err) {
      console.error("Failed to fetch complaints:", err)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem("token")
    try {
      await axios.post(
        "http://localhost:5000/api/complaint",
        { type, description },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setType(complaintTypes[0])
      setDescription("")
      fetchComplaints()
    } catch (err) {
      alert("Failed to submit complaint")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Complaint / Service Request</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit a Complaint</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-3 py-2 w-full">
                {complaintTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} required className="border rounded px-3 py-2 w-full" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? "Submitting..." : "Submit Complaint"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">My Complaints</h2>
      <div className="space-y-4  ">
        {complaints.length === 0 ? (
          <p className="text-gray-500 ">No complaints submitted yet.</p>
        ) : (
          complaints.map(complaint => (
            <Card key={complaint._id} className="border-0 glass-card  bg-gray-90">
              <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
                <div>
                  <div className="font-semibold">{complaint.type}</div>
                  <div className="text-gray-700">{complaint.description}</div>
                  <div className="text-gray-500 text-sm">{new Date(complaint.createdAt).toLocaleString()}</div>
                </div>
                <Badge className={
                  complaint.status === "resolved"
                    ? "bg-green-500 text-white"
                    : complaint.status === "in progress"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-400 text-white"
                }>
                  {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
