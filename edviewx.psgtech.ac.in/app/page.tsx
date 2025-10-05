import Link from "next/link"
import { User, UtensilsCrossed, QrCode, Building, ChefHat, ArrowRight, CalendarCheck, Wrench } from "lucide-react"

const features = [
  {
    name: "Student Profile",
    description: "View and manage your personal information, academic details, and account status.",
    icon: User,
    href: "/profile",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
  },
  {
    name: "Leave Management",
    description: "Apply for leave, track status, and view your leave history.",
    icon: CalendarCheck,
    href: "/leave",
    color: "from-pink-500 to-pink-600",
    bgColor: "from-pink-50 to-pink-100",
  },
  {
    name: "Food Menu",
    description: "Browse available meals, place orders, and manage your dining preferences.",
    icon: UtensilsCrossed,
    href: "/food-menu",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100",
  },
  {
    name: "Token Management",
    description: "Track your meal tokens, view history, and manage QR codes.",
    icon: QrCode,
    href: "/tokens",
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100",
  },
  {
    name: "Room Details",
    description: "Access your hostel information, room details, and accommodation status.",
    icon: Building,
    href: "/room-details",
    color: "from-cyan-500 to-cyan-600",
    bgColor: "from-cyan-50 to-cyan-100",
  },
  {
    name: "Mess Details",
    description: "View mess information, supervisors, and billing details.",
    icon: ChefHat,
    href: "/mess-details",
    color: "from-orange-500 to-orange-600",
    bgColor: "from-orange-50 to-orange-100",
  },
  {
    name: "Complaint/Service Request",
    description: "Submit maintenance requests and track their status.",
    icon: Wrench,
    href: "/complaints",
    color: "from-red-500 to-red-600",
    bgColor: "from-red-50 to-red-100",
  }
]

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to ECAMPUS</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your comprehensive student management platform. Access all your academic and hostel services in one place.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link key={feature.name} href={feature.href} className="group block">
              <div className={`feature-card bg-gradient-to-br ${feature.bgColor} border-0 h-full`}>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg float-animation`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.name}</h3>

                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">4.8</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">1,200+</div>
          <div className="text-sm text-gray-600">Active Students</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
          <div className="text-sm text-gray-600">Support Available</div>
        </div>
        <div className="glass-card rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
          <div className="text-sm text-gray-600">Uptime</div>
        </div>
      </div>
    </div>
  )
}
