import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PlusSquare, User } from "lucide-react"
import NavLinks from "@/components/layout/NavLinks"
import SearchBar from "@/components/layout/SearchBar"

interface User {
  name: string
  username: string
  avatar?: string
}

export default function Navbar() {
  const user = null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/50 backdrop-blur-sm ">
      <div className="max-w-8xl mx-auto px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <NavLink to="/" className="font-bold text-xl md:text-2xl">
            Simple<span className="text-blue-500">Blog</span>
          </NavLink>
          <NavLinks />
        </div>
        <div className="flex items-center gap-4">
          <SearchBar />

          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild className="hidden md:flex rounded-full hover:bg-primary/10">
                <NavLink to="/create">
                  <PlusSquare className="h-5 w-5" />
                  <span className="sr-only">Create Post</span>
                </NavLink>
              </Button>

              <div className="relative">
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <div className="h-10 w-10 border-2 border-primary/10 rounded-full overflow-hidden">
                    <img
                      src={user.avatar || "/placeholder-avatar.jpg"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Button>
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-48">
                  <NavLink to={`/profile/${user.username}`} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200">Profile</NavLink>
                  <NavLink to="/settings" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200">Settings</NavLink>
                  <hr />
                  <NavLink
                    to="#"
                    onClick={() => alert("Logging out...")}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                  >
                    Log out
                  </NavLink>
                </div>
              </div>
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
