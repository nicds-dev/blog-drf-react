import FeaturedPost from "@/features/posts/components/FeaturedPost"
import PostList from "@/features/posts/components/PostList"
import Header from "@/pages/home/HomeHeader"

export default function HomePage() {
  return (
    <main>
      <Header />
      <FeaturedPost />
      <PostList />
    </main>
  )
}
