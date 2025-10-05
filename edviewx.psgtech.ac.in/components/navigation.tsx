"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  Home,
  User,
  UtensilsCrossed,
  QrCode,
  Building,
  ChefHat,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Food Menu", href: "/food-menu", icon: UtensilsCrossed },
  { name: "Tokens", href: "/tokens", icon: QrCode },
  { name: "Leave", href: "/leave", icon: UserPlus },
  { name: "Room Details", href: "/room-details", icon: Building },
  { name: "Mess Details", href: "/mess-details", icon: ChefHat },
]

export default function Navigation() {
  const pathname = usePathname()

  // track sheet open state (controlled)
  const [isOpen, setIsOpen] = useState(false)

  // mounted prevents SSR/client mismatch when checking localStorage
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // only run on client
    if (typeof window === "undefined") return
    setMounted(true)

    const checkLogin = () => {
      const token = localStorage.getItem("token")
      setIsLoggedIn(!!token)
    }

    // initial check
    checkLogin()

    // listen for storage changes (other tabs)
    window.addEventListener("storage", checkLogin)

    // listen for custom auth events (same-tab updates)
    window.addEventListener("auth", checkLogin)

    return () => {
      window.removeEventListener("storage", checkLogin)
      window.removeEventListener("auth", checkLogin)
    }
  }, [])

  // convenience handler for logout
  const handleLogout = (closeSheet = false) => {
    localStorage.removeItem("token")
    // optionally remove other auth info if present
    // localStorage.removeItem("username")
    // trigger listeners (same tab)
    window.dispatchEvent(new Event("auth"))
    if (closeSheet) setIsOpen(false)
    // optional redirect:
    if (typeof window !== "undefined") window.location.href = "/"
  }

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  // avoid rendering until mounted to prevent hydration differences
  if (!mounted) return null

  return (
    <nav className="gradient-bg shadow-xl sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <div className="text-lg font-bold text-blue-600">PSG</div>
            </div>
            <span className="text-xl font-bold text-white">HOSTEL</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoggedIn ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-white text-blue-600 hover:bg-white/90">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => handleLogout(false)}
              >
                Logout
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80 bg-white">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <div className="text-sm font-bold text-white">EC</div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">ECAMPUS</span>
                  </div>

                  {/* Close button MUST close the sheet */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-900"
                    aria-label="Close menu"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex-1 space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>

                <div className="border-t pt-6 space-y-3">
                  {!isLoggedIn ? (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <LogIn className="w-4 h-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Register
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Button
                      className="w-full justify-start bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => {
                        handleLogout(true) // logout and close sheet
                      }}
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
