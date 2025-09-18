import { NavLink } from "react-router-dom"
import type { Post } from "@/types/post"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, ArrowRight } from "lucide-react"

interface PostCardProps {
  post: Post
  variant?: "list" | "featured"
}

export default function PostCard({ post, variant = "list" }: PostCardProps) {

  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const isFeatured = variant === "featured"

  return (
    <Card
      className={`overflow-hidden flex flex-col h-full p-0 gap-0 ${isFeatured ? "md:flex-row border-0" : "border"}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${isFeatured && "md:w-1/2"}`}>
        <NavLink
        to={`/post/${post.slug}`}
        className={`${isFeatured ? "md:w-1/2 aspect-[16/9]" : "aspect-[16/9]"}`}
        >
          <img
            src={post.image || "https://cdn.pixabay.com/photo/2023/03/16/08/42/camping-7856198_640.jpg"}
            alt={post.title}
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-500"
          />
        </NavLink>

        {post.category && (
          <div className="absolute top-3 left-3">
            <NavLink
              to={`/category/${post.category.slug}`}
              className="tag-badge bg-black/50 backdrop-blur-sm hover:bg-blue-500 transition-colors"
            >
              {post.category.name}
            </NavLink>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className={`flex flex-col flex-1 ${isFeatured ? "p-6 md:p-8 md:w-1/2" : "p-6"}`}>
        {/* Author */}
        <div className={`flex items-center gap-2 ${isFeatured ? "mb-6" : "mb-3"}`}>
          <NavLink to={`/profile/${post.author.username}`} className="flex items-center gap-2 group">
            <Avatar className={isFeatured ? "h-8 w-8" : "h-6 w-6"}>
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.username} />
              <AvatarFallback>{post.author.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm font-medium group-hover:text-blue-500 transition-colors">
                {post.author.full_name}
              </span>
              {isFeatured && (
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              )}
            </div>
          </NavLink>
          {!isFeatured && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </>
          )}
        </div>

        {/* Title */}
        <NavLink to={`/post/${post.slug}`} className="block group">
          <h3
            className={`font-semibold line-clamp-2 group-hover:text-blue-500 transition-colors mb-2
              ${isFeatured ? "text-2xl md:text-3xl" : "text-lg"}`}
          >
            {post.title}
          </h3>
        </NavLink>

        {/* Resume */}
        <p className={`line-clamp-3 text-muted-foreground ${isFeatured ? "mb-6" : "text-sm mb-3"}`}>
          {post.content.replace(/[#*]/g, "").trim().split("\n")[0]}
        </p>

        {/* Tags */}
        <div className={`flex flex-wrap gap-2 ${isFeatured ? "mb-6" : "mb-3"}`}>
          {post.hashtags.slice(0, 3).map((tag) => (
            <NavLink
              key={tag.id}
              to={`/search?q=${encodeURIComponent(tag.name)}`}
              className="tag-badge bg-slate-800 hover:bg-primary/10 text-muted-foreground hover:text-blue-500 transition-colors"
            >
              #{tag.name}
            </NavLink>
          ))}
        </div>

        {/* Featured footer */}
        {isFeatured && (
          <CardFooter className="mt-auto p-0">
            <Button asChild className="group">
              <NavLink to={`/post/${post.slug}`}>
                Read article
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            </Button>
          </CardFooter>
        )}
      </CardContent>

      {/* List footer */}
      {!isFeatured && (
        <CardFooter className="flex justify-between items-center border-t p-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground hover:text-blue-500 cursor-not-allowed group"
          >
            <Heart
              className="h-4 w-4 group-hover:fill-blue-200"
            />
            <span className="group-hover:text-blue-200">{post.likes_count}</span>
          </Button>
          <NavLink
            to={`/post/${post.slug}`}
            className="text-xs font-medium text-blue-500 hover:underline underline-offset-4"
          >
            Read more
          </NavLink>
        </CardFooter>
      )}
    </Card>
  )
}
