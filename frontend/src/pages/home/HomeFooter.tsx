import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/useAuth"
import { ArrowUpRight } from "lucide-react"

export default function Footer() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="bg-[#0c1027]">
      <div className="max-w-5xl text-center py-28 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to share your <span className="text-gradient">story</span>?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {isAuthenticated ?
            "Keep sharing your thoughts and inspiring others. Check out the latest stories or start a new one!" : 
            "Join our community of writers and readers. Create an account to start sharing your thoughts and engaging with content."
          }
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <Button asChild variant="outline" size="lg" className="border-violet-500/50 hover:shadow-[0_0_10px_rgba(142,81,255,0.5)] group">
              <Link to="/create">
                Turn your thoughts into a story
                <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" size="lg">
                <Link to="/signup">Get started</Link>
              </Button>
              <Button asChild size="lg">
                <Link to="/login">Log in</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}