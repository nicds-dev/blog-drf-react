import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(location.search)
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim())
    } else {
      params.delete("search")
    }

    navigate(`/explore?${params.toString()}`)
    setSearchQuery("")
  }

  return (
    <form onSubmit={handleSearch} className="hidden md:flex relative">
      <Input
        type="search"
        placeholder="Search posts..."
        className="w-[200px] lg:w-[300px]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full w-10"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  )
}
