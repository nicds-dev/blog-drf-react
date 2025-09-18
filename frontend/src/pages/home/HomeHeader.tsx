import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <section className="max-w-5xl text-center py-28 mx-auto">
      <h1 className="font-bold text-blue-500 text-6xl mb-6 animate-in">
        Share your thoughts with the world
      </h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in">
        A simple platform for sharing ideas, stories, and insights. No distractions, just pure content.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild size="lg">
          <NavLink to="/create">Create a post</NavLink>
        </Button>
        <Button asChild variant="outline" size="lg">
          <NavLink to="/explore">Explore posts</NavLink>
        </Button>
      </div>
    </section>
  )
}