import { useEffect, useState } from "react"
import type { Post } from "@/types/post"
import { getPosts } from "../services"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import PostCard from "@/features/posts/components/PostCard"

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    getPosts().then(setPosts)
  }, [])

  return (
    <section className="py-16">
      <div className="my-container">
        <header className="mb-8 flex justify-between">
          <h2 className="text-3xl font-bold">Recent Posts</h2>
          <Button asChild variant="ghost" className="group">
            <a href="/explore" className="flex items-center">
              View all
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} variant="list" />
          ))}
        </div>
      </div>
    </section>
  )
}