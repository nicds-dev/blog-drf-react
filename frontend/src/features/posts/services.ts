import api from "@/services/api"
import type { Post } from "@/types/post"

export const getFeaturedPost = async (): Promise<Post> => {
  const response = await api.get("/posts/featured/")
  return response.data
}

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get("/posts/")
  return response.data.results ?? response.data // paginación futura
}
