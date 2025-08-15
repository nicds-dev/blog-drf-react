import { useEffect, useState } from 'react'
import { getPosts } from '@/services/api'
import type { Post } from '@/types/post'
import FeaturedPost from '@/sections/FeaturedPost'
import PostList from '@/sections/PostList'
import Header from '@/sections/Header'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    getPosts().then(setPosts)
  }, [])

  return (
    <main>
      <Header />
      <FeaturedPost />
      <PostList posts={posts} />
    </main>
  )
}
