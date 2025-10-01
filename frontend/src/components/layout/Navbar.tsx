import { NavLink, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusSquare, User } from "lucide-react"
import NavLinks from "@/components/layout/NavLinks"
import SearchBar from "@/components/layout/SearchBar"
import { useAuth } from "@/features/auth/useAuth"
import { useState } from "react"

export default function Navbar() {
  const { isAuthenticated, logoutUser } = useAuth()
  const [ isLoggingOut, setIsLoggingOut ] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try{
      await logoutUser()
      await new Promise(resolve => setTimeout(resolve, 50))
      navigate("/", {replace: true})
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-zinc-950/15 backdrop-blur-[6px] ">
      <div className="max-w-8xl mx-auto px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <NavLink to="/" className="font-bold text-xl md:text-2xl">
            Simple<span className="text-blue-500">Blog</span>
          </NavLink>
          <NavLinks />
        </div>
        <div className="flex items-center gap-4">
          <SearchBar />

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" asChild className="h-10 w-10 hidden rounded-full md:flex dark:hover:bg-blue-500/10">
                <NavLink to="/create">
                  <PlusSquare className="h-5 w-5" />
                  <span className="sr-only">Create Post</span>
                </NavLink>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage
                        src={"/placeholder-avatar.jpg"}
                        alt="User Avatar"
                      />
                      <AvatarFallback className="bg-white">
                        <User className="h-5 w-5 text-black" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-0">
                  <DropdownMenuItem>
                    <NavLink to="/profile/username" className="">Profile</NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink to="/settings" className="">Settings</NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost">
                <NavLink to="/login">Log in</NavLink>
              </Button>
              <Button>
                <NavLink to="/signup">Sign up</NavLink>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
