import { usePosts } from "@/features/posts/hooks/usePosts"
import Header from "@/pages/home/HomeHeader"
import FeaturedPost from "@/features/posts/components/FeaturedPost"
import PostList from "@/features/posts/components/PostList"
import Footer from "@/pages/home/HomeFooter"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const { posts, loading, error } = usePosts({ category: "all" })

  return (
    <main>
      <Header />
      <FeaturedPost />
      <section className="py-16">
        <div className="my-container">
          <header className="mb-8 flex justify-between">
            <h2 className="text-3xl font-bold">Recent Posts</h2>
            <Button asChild variant="ghost" className="group">
              <Link to="/explore" className="flex items-center">
                View all
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </header>
          {/* Show loading, error message or post list */}
          {loading && <div>Loading posts...</div>}
          {error && <div>{error}</div>}
  
          {!loading && !error && <PostList posts={posts} />}
        </div>
      </section>
      <Footer />
    </main>
  )
}
