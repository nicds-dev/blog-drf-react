import { useState, useEffect } from "react"
import { getPosts } from "@/features/posts/services"
import type { Post } from "@/types/post"

export function usePosts(filters: {
  category?: string
  author?: string
  hashtag?: string
  title?: string
}) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getPosts(filters)
        setPosts(data)
      } catch (err) {
        setError("Oops! Something went wrong. Please try reloading the page or come back later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [filters.category, filters.author, filters.hashtag, filters.title])

  return { posts, loading, error }
}
