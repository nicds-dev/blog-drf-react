import Header from "@/pages/home/HomeHeader"
import FeaturedPost from "@/features/posts/components/FeaturedPost"
import PostList from "@/features/posts/components/PostList"
import Footer from "@/pages/home/HomeFooter"

export default function HomePage() {
  return (
    <main>
      <Header />
      <FeaturedPost />
      <PostList />
      <Footer />
    </main>
  )
}
