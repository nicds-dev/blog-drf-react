import { Link } from "react-router-dom"
import type { Post } from "@/types/post"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import { LikeButton } from "./LikeButton"
import ReactMarkdown from "react-markdown"
import { useAuth } from "@/features/auth/useAuth"

interface PostCardProps {
  post: Post
  variant?: "list" | "featured"
}

export default function PostCard({ post, variant = "list" }: PostCardProps) {
  const { isAuthenticated } = useAuth()

  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const isFeatured = variant === "featured"

  return (
    <Card className={`overflow-hidden flex flex-col h-full p-0 gap-0 ${isFeatured ? "md:flex-row border-0" : "border"}`}>
      {/* Image */}
      <div className={`relative overflow-hidden ${isFeatured && "md:w-1/2"}`}>
        <Link
        to={`/post/${post.slug}`}
        className={`${isFeatured ? "md:w-1/2 aspect-[16/9]" : "aspect-[16/9]"}`}
        >
          <img
            src={post.image || "https://cdn.pixabay.com/photo/2023/03/16/08/42/camping-7856198_640.jpg"}
            alt={post.title}
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-500"
          />
        </Link>

        {post.category && (
          <div className="absolute top-3 left-3">
            <Link
              to={`/explore/${post.category.slug}`}
              className="tag-badge bg-slate-900/50 backdrop-blur-sm hover:bg-blue-500/50 transition-colors"
            >
              {post.category.name}
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className={`flex flex-col flex-1 ${isFeatured ? "p-6 md:p-8 md:w-1/2" : "p-6"}`}>
        {/* Author */}
        <div className={`flex items-center gap-2 ${isFeatured ? "mb-6" : "mb-3"}`}>
          <Link to={`/profile/${post.author.username}`} className="flex items-center gap-2 group">
            <Avatar className={isFeatured ? "h-8 w-8" : "h-6 w-6"}>
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.username} />
              <AvatarFallback className="font-bold text-blue-500">{post.author.full_name.charAt(0).toLowerCase()}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm font-medium group-hover:text-blue-500 transition-colors">
                {post.author.full_name}
              </span>
              {isFeatured && (
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              )}
            </div>
          </Link>
          {!isFeatured && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </>
          )}
        </div>

        {/* Title */}
        <div className="min-h-[2.5lh]">
          <Link to={`/post/${post.slug}`} className="block group">
            <h3
              className={`font-semibold line-clamp-2 group-hover:text-blue-500 transition-colors
              ${isFeatured ? "text-2xl md:text-3xl mb-4" : "text-lg mb-2"}`}
            >
              {post.title}
            </h3>
          </Link>
        </div>

        {/* Resume */}
        <div
          className={`line-clamp-3 text-muted-foreground ${
            isFeatured ? "mb-6" : "text-sm mb-4"
          }`}
        >
          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </div>


        {/* Tags */}
        <div className={`flex flex-wrap gap-2 ${isFeatured ? "mb-6" : "mt-auto"}`}>
          {post.hashtags.slice(0, 3).map((tag) => (
            <Link
              key={tag.id}
              to={`/explore?hashtag=${encodeURIComponent(tag.name)}`}
              className="tag-badge bg-slate-800 hover:bg-primary/10 text-muted-foreground hover:text-blue-500 transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>

        {/* Featured footer */}
        {isFeatured && (
          <CardFooter className="flex justify-between items-center mt-auto p-0">
            <LikeButton
              slug={post.slug}
              initialLikes={post.likes_count}
              initiallyLiked={post.is_liked}
              isAuthenticated={isAuthenticated}
            />
            <ReadCTA variant="article" slug={post.slug} />
          </CardFooter>
        )}
      </CardContent>

      {/* List footer */}
      {!isFeatured && (
        <CardFooter className="flex justify-between items-center border-t p-4">
          <LikeButton
            slug={post.slug}
            initialLikes={post.likes_count}
            initiallyLiked={post.is_liked}
            isAuthenticated={isAuthenticated}
          />
          <ReadCTA variant="more" slug={post.slug} />
        </CardFooter>
      )}
    </Card>
  )
}

function ReadCTA({ variant, slug }: { variant: "article" | "more"; slug: string }) {
  if (variant === "article") {
    return (
      <Button asChild className="group">
        <Link to={`/post/${slug}`}>
          Read article
          <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </Button>
    )
  }

  return (
    <Link
      to={`/post/${slug}`}
      className="text-sm font-medium text-blue-500 hover:text-violet-500 flex items-center gap-1 group"
    >
      Read more
      <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </Link>
  )
}