import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Users, Calendar, FileText, X, Check } from "lucide-react"

const messDetails = [
  {
    label: "Mess Name",
    value: "G Mess",
    icon: ChefHat,
  },
  {
    label: "Mess Type",
    value: "South Indian",
    icon: ChefHat,
  },
  {
    label: "Member Since",
    value: "1",
    icon: Calendar,
  },
]

const supervisors = [
  "Arasakumar.R",
  "Arun Pandian C",
  "Balachandran S",
  "Balaji J",
  "Debashish Chattrejee",
  "Ilavarasan S",
  "Jayanta Mondal",
  "M.Madhavan",
  "Pratheeshkumar S",
  "Radhakrishnan S",
  "Senthilkumar R",
  "Shakthiganesan M",
]

export default function MessDetailsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Mess Details</h1>
        <p className="text-gray-600">View your mess information, supervisors, and billing details.</p>
      </div>

      {/* Basic Mess Information */}
      <Card className="border-0 glass-card mb-8 bg-gray-90 ">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-600" />
            Mess Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {messDetails.map((detail, index) => {
              const Icon = detail.icon
              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center gap-3 ">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center ">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-gray-600 font-medium">{detail.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{detail.value}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mess Supervisors */}
      <Card className="border-0 glass-card mb-8 bg-gray-90" >
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Mess Supervisors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {supervisors.map((supervisor, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-30 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700 font-medium">{supervisor}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ">
        <Card className="border-0 glass-card bg-gray-90">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Token Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Egg Token</span>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                <Badge className="bg-red-100 text-red-800">No</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Non Veg Token</span>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                <Badge className="bg-red-100 text-red-800">No</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">NI Mess Applied</span>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                <Badge className="bg-red-100 text-red-800">Not Applied</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 glass-card bg-gray-90">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Membership Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Member Since</span>
              <Badge className="bg-green-100 text-green-800">1 Year</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Mess Type</span>
              <span className="font-medium">South Indian</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mess Bill */}
      <Card className="border-0 glass-card bg-gray-90">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            Billing Information
          </CardTitle>
        </CardHeader>
        
        <CardContent>
  <div className="text-center py-8">
    <FileText className="w-16 h-16 text-purple-600 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">View Mess Bill</h3>
    <p className="text-gray-600 mb-6">Access your detailed mess bill and payment history</p>

    {/* Wrap Button with Link */}
    <Link href="/profile">
      <Button className="bg-purple-600 hover:bg-purple-700 flex items-center justify-center mx-auto">
        <FileText className="w-4 h-4 mr-2" />
        Click here to view mess bill
      </Button>
    </Link>
  </div>
</CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 text-center">
          <ChefHat className="w-8 h-8 text-orange-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Menu</h3>
          <p className="text-sm text-gray-600 mb-4">View today's menu</p>
          <Link href="/food-menu">
            <Button size="sm" variant="outline" className="w-full bg-transparent">
              View Menu
            </Button>
          </Link>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Feedback</h3>
          <p className="text-sm text-gray-600 mb-4">Share your feedback</p>
          <Button size="sm" variant="outline" className="w-full bg-transparent">
            Give Feedback
          </Button>
        </div>

        <div className="glass-card rounded-xl p-6 text-center">
          <FileText className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Complaints</h3>
          <p className="text-sm text-gray-600 mb-4">Register a complaint</p>
          <Button size="sm" variant="outline" className="w-full bg-transparent">
            File Complaint
          </Button>
        </div>
      </div>
    </div>
  )
}
