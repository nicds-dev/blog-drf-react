import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { toggleLike } from "@/features/posts/services"

interface LikeButtonProps {
  slug: string
  initialLikes: number
  initiallyLiked?: boolean
  isAuthenticated: boolean
  className?: string
  onUpdate?: (likes: number, liked: boolean) => void // To sync with parent component
}

export function LikeButton({
  slug,
  initialLikes,
  initiallyLiked = false,
  isAuthenticated,
  className = "",
  onUpdate,
}: LikeButtonProps) {
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initiallyLiked)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (!isAuthenticated || isLiking) return

    setIsLiking(true)
    const previousState = { likesCount, isLiked }

    // Optimistic update
    setIsLiked(!isLiked)
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1))
    onUpdate?.(isLiked ? likesCount - 1 : likesCount + 1, !isLiked)

    try {
      const response = await toggleLike(slug)
      setIsLiked(response.is_liked)
      setLikesCount(response.likes_count)
      onUpdate?.(response.likes_count, response.is_liked)
    } catch (error: any) {
      setIsLiked(previousState.isLiked)
      setLikesCount(previousState.likesCount)
      onUpdate?.(previousState.likesCount, previousState.isLiked)
      const message = error?.response?.data?.detail || "Failed to update like"
      toast.error(message)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {!isAuthenticated ? (
        <Button
          variant="ghost"
          size="sm"
          className="cursor-not-allowed rounded-full hover:bg-primary/10"
        >
          <Heart className="h-6 w-6 text-muted-foreground" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`rounded-full hover:bg-primary/10 transition-transform duration-300 ${isLiking ? "scale-110" : ""}`}
        >
          <Heart
            className={`h-6 w-6 transition-transform duration-300 ${isLiked ? "fill-primary text-primary" : "hover:text-primary"} ${isLiking ? "scale-110" : ""}`}
          />
        </Button>
      )}
      <span className="text-sm text-muted-foreground">
        {likesCount} {likesCount === 1 ? "Like" : "Likes"}
      </span>
    </div>
  )
}
