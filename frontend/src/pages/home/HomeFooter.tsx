import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <section className="bg-[#0F1625]">
      <div className="max-w-5xl text-center py-28 mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl mb-6">Ready to share your story?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Join our community of writers and readers. Create an account to start sharing your thoughts and engaging with content.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" size="lg">
            <NavLink to="/signup">Get started</NavLink>
          </Button>
          <Button size="lg">
            <NavLink to="/login">Log in</NavLink>
          </Button>
        </div>
      </div>
    </section>
  )
}