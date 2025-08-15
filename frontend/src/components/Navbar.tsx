import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, PlusSquare } from "lucide-react"
import NavLinks from "@/components/navbar/NavLinks"

interface User {
  name: string
  username: string
  avatar?: string
}

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState<string>("")

  const user = null

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/10 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-8xl mx-auto px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <a href="/" className="font-bold text-xl md:text-2xl">
            Simple<span className="text-blue-400">Blog</span>
          </a>
          <NavLinks />
        </div>
        <div className="flex items-center gap-4">
          <form className="hidden md:flex relative">
            <Input
              type="search"
              placeholder="Search posts..."
              className="w-[200px] lg:w-[300px] pr-10 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="ghost" size="icon" className="absolute cursor-pointer right-1 top-1 h-8 w-8">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>

          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild className="hidden md:flex rounded-full hover:bg-primary/10">
                <a href="/create">
                  <PlusSquare className="h-5 w-5" />
                  <span className="sr-only">Create Post</span>
                </a>
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
                  <a href={`/profile/${user.username}`} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200">Profile</a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200">Settings</a>
                  <hr />
                  <a
                    href="#"
                    onClick={() => alert("Logging out...")}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                  >
                    Log out
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost">
                <a href="/login">Log in</a>
              </Button>
              <Button>
                <a href="/signup">Sign up</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
