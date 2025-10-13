"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Plus, Home, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

function normalizeResponse(res: any) {
  if (!res) return null
  return res.data?.data ?? res.data ?? null
}

export default function ProfilePage() {
  const router = useRouter()
  const [personalInfo, setPersonalInfo] = useState<any>(null)
  const [financialInfo, setFinancialInfo] = useState({ establishment: 0, deposit: 0, balance: 0 })
  const [depositAmount, setDepositAmount] = useState<number | "">(0)
  const [roomInfo, setRoomInfo] = useState<any>(null)
  const [fetching, setFetching] = useState(true)
  const [loadingDeposit, setLoadingDeposit] = useState(false)
  const [updatingRoom, setUpdatingRoom] = useState(false)

  // Controlled inputs
  const [block, setBlock] = useState<string>("")
  const [floor, setFloor] = useState<string>("")
  const [roomNumber, setRoomNumber] = useState<string>("")
  const [roomType, setRoomType] = useState<string>("")
  const [joiningDate, setJoiningDate] = useState<string>("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setFetching(false)
      return
    }
    const config = { headers: { Authorization: `Bearer ${token}` } }

    const fetchProfile = async () => {
      setFetching(true)
      try {
        const [personalRes, roomRes, financeRes] = await Promise.all([
          axios.get("http://localhost:5000/api/profile/personal", config).catch(() => ({ data: null })),
          axios.get("http://localhost:5000/api/room/my", config).catch(() => ({ data: null })),
          axios.get("http://localhost:5000/api/profile/financial", config).catch(() => ({ data: null })),
        ])

        const personal = normalizeResponse(personalRes)
        const room = normalizeResponse(roomRes)
        const finance = normalizeResponse(financeRes)

        setPersonalInfo(personal || {})
        setRoomInfo(room || null)
        setFinancialInfo(finance || { establishment: 0, deposit: 0, balance: 0 })

        // Pre-fill controlled inputs
        setBlock(room?.accommodationInfo?.block ?? "")
        setFloor(room?.accommodationInfo?.floor ?? "")
        setRoomNumber(room?.accommodationInfo?.roomNumber ?? "") // your backend might not have room number field separately
        setRoomType(room?.accommodationInfo?.roomType ?? "")
        setJoiningDate(room?.accommodationInfo?.joiningDate ? new Date(room.accommodationInfo.joiningDate).toISOString().slice(0, 10) : "")
      } catch (err) {
        console.error("fetchProfile error:", err)
      } finally {
        setFetching(false)
      }
    }

    fetchProfile()
  }, [])

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) return alert("Enter a positive deposit amount")
    const token = localStorage.getItem("token")
    if (!token) return alert("Please login first.")
    const config = { headers: { Authorization: `Bearer ${token}` } }

    setLoadingDeposit(true)
    try {
      const res = await axios.post("http://localhost:5000/api/profile/deposit", { amount: Number(depositAmount) }, config)
      const data = normalizeResponse(res) ?? res.data ?? res
      if (data) setFinancialInfo(prev => ({ ...prev, deposit: data.deposit ?? prev.deposit, balance: data.balance ?? prev.balance }))
      setDepositAmount(0)
    } catch (err) {
      console.error("Deposit failed:", err)
      alert("Deposit failed. Try again.")
    } finally {
      setLoadingDeposit(false)
    }
  }

const handleRoomUpdate = async () => {
  if (!block || !floor || !roomType || !joiningDate || !roomNumber) {
    return alert("Please fill all required room fields");
  }

  const token = localStorage.getItem("token");
  if (!token) return alert("Please login first.");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  setUpdatingRoom(true);
  try {
    const res = await axios.post(
      "http://localhost:5000/api/profile/update",
      {
        block,
        floor,
        roomNo: roomNumber, // send roomNumber as roomNo to match backend
        roomType,
        joiningDate,
      },
      config
    );

    // Frontend expects normalized data like /room/my
    const body = res.data?.data ?? res.data ?? null;
    if (body) setRoomInfo(body);

    alert("Room updated successfully");
  } catch (err) {
    console.error("Room update failed:", err);
    alert("Room update failed. Try again.");
  } finally {
    setUpdatingRoom(false);
  }
};

  if (fetching) return <p className="text-center mt-10">Loading profile...</p>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="glass-card rounded-2xl p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-xl border">
            <Image
              src={personalInfo?.profilePhoto || "/placeholder.svg?height=96&width=96"}
              alt="Profile"
              width={96}
              height={96}
              className="object-cover"
            />
            {personalInfo?.verified && (
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{personalInfo?.fullname ?? "N/A"}</h1>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800">{personalInfo?.status ?? "Student"}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-3">
              <div className="font-medium">{personalInfo?.studentId ?? "N/A"}</div>
              <div>{personalInfo?.department ?? "Dept: N/A"}</div>
              <div>{`Year: ${personalInfo?.year ?? "N/A"}`}</div>
              <div className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span>{roomInfo?.accommodationInfo?.block ?? "No room allocated"}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{roomInfo?.accommodationInfo?.floor ?? "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-blue-900">Establishment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">₹{financialInfo.establishment}</div>
              <p className="text-sm text-blue-600 mt-1">Initial fee paid</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-green-900">Deposit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">₹{financialInfo.deposit}</div>
              <p className="text-sm text-green-600 mt-1">Security deposit</p>
              <div className="flex mt-3 gap-2">
                <Input
                  type="number"
                  value={depositAmount === 0 ? "" : depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Add deposit"
                  className="flex-1"
                />
                <Button onClick={handleDeposit} disabled={loadingDeposit}>
                  <Plus className="w-4 h-4 mr-1" />
                  {loadingDeposit ? "Adding..." : "Add"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-purple-900">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">₹{financialInfo.balance}</div>
              <p className="text-sm text-purple-600 mt-1">Current balance</p>
            </CardContent>
          </Card>
        </div>

        {/* Room Details */}
        {roomInfo ? (
          <Card className="border-0 glass-card mb-6 p-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Current Room Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span>Block</span><span>{roomInfo.accommodationInfo?.block}</span></div>
              <div className="flex justify-between"><span>Floor</span><span>{roomInfo.accommodationInfo?.floor}</span></div>
              <div className="flex justify-between"><span>Room No</span><span>{roomInfo.accommodationInfo?.roomNumber}</span></div>
              <div className="flex justify-between"><span>Type</span><span>{roomInfo.accommodationInfo?.roomType}</span></div>
              <div className="flex justify-between"><span>Joining Date</span><span>{roomInfo.accommodationInfo?.joiningDate ? new Date(roomInfo.accommodationInfo.joiningDate).toLocaleDateString() : "N/A"}</span></div>
              <div className="flex justify-between"><span>Occupancy</span><span>{roomInfo.roomFeatures?.occupancy ?? 0}/{roomInfo.roomFeatures?.maxOccupancy ?? 3}</span></div>
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-gray-600 mb-6">No room allocated.</p>
        )}

        {/* Update Room Form */}
        <Card className="border-0 glass-card mb-6 p-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Update / Assign Room</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input value={block} onChange={(e) => setBlock(e.target.value)} placeholder="Block (e.g., G3)" />
              <Input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="Floor (e.g., 4)" />
              <Input value={roomType} onChange={(e) => setRoomType(e.target.value)} placeholder="Room Type (e.g., 3-in-1)" />
              <Input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
              <Input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="Room Number (e.g., 101)"
/>

            </div>

            <Button onClick={handleRoomUpdate} disabled={updatingRoom} className="w-full mt-2">
              {updatingRoom ? "Updating..." : "Update Room"}
            </Button>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <div className="mt-6">
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
