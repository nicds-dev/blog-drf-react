import type { Post } from "@/types/post"
import PostCard from "@/features/posts/components/PostCard"

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} variant="list" />
      ))}
    </div>
)
}