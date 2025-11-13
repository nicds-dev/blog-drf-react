import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Header() {
  return (
    <section className="relative my-container" >

      {/* Floating Elements */}
      <div className="absolute top-20 left-1 w-20 h-20 bg-primary/15 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-1 w-32 h-32 bg-accent/15 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 left-3/12 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-float" />

      <div className="max-w-5xl text-center py-28 mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold max-w-3xl mx-auto mb-6">
          Share your <span className="text-gradient">thoughts</span> with the world
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          A simple platform for sharing ideas, stories, and insights. No distractions, just pure content.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="group">
            <Link to="/create">
            Create a post
            <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/explore">Explore posts</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}