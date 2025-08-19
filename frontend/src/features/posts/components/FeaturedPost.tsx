import { useEffect, useState } from "react"
import type { Post } from "@/types/post"
import { getFeaturedPost } from "../services"
import PostCard from "@/features/posts/components/PostCard"

export default function FeaturedPost() {
  const [featured, setFeatured] = useState<Post | null>(null)

  useEffect(() => {
    getFeaturedPost().then(setFeatured)
  }, [])

  if (!featured) return null 

  return (
    <section className="py-16 bg-slate-950">
      <div className="my-container">
        <div className="mx-auto mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2 text-white">Featured Post</h2>
          <p className="text-muted-foreground">Our top pick for you to read today</p>
        </div>
        <PostCard post={featured} variant="featured" />
      </div>
    </section>
  )
}