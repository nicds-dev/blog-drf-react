import { useParams, useNavigate } from "react-router-dom"
import { usePosts } from "@/features/posts/hooks/usePosts"
import PostList from "@/features/posts/components/PostList"
import CategoryFilter from "@/features/posts/components/CategoryFilter"
import LoadingMessage from "@/components/ui/loading-message"
import ErrorMessage from "@/components/ui/error-message"

export default function ExplorePage() {
  const { category } = useParams()
  const navigate = useNavigate()

  const currentCategory = category  || "all"
  const { posts, loading, error } = usePosts(currentCategory)

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === "all") {
      navigate("/explore", { replace: true })
    } else {
      navigate(`/explore/${newCategory}`)
    }
  }

  return (
    <main>
      <div className="my-container py-12">
        <header className="mb-4">
          <h1 className="text-3xl font-bold mb-2">Explore Posts</h1>
          <span className="text-muted-foreground">Discover content from our community</span>
        </header>
        <div className="flex flex-wrap gap-2 mb-8">
          <CategoryFilter
            setCategory={handleCategoryChange}
            currentCategory={currentCategory}
          />
        </div>

        {/* Show loading, error message or post list */}
        {loading && <LoadingMessage />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && <PostList posts={posts} />}
      </div>
    </main>
  )
}