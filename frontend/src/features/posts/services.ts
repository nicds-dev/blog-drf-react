import api from "@/services/api"
import type { Post } from "@/types/post"
import type { Category } from "@/types/post"

export const getFeaturedPost = async (): Promise<Post> => {
  const response = await api.get("/posts/featured/")
  return response.data
}

export const getPosts = async (
  category: string = "all", 
  search: string = ""
): Promise<Post[]> => {
  const params = new URLSearchParams()

  if (category !== "all") {
    params.append("category", category)
  }
  if (search.trim()) {
    params.append("search", search.trim())
  }

  const url = `/posts/${params.toString() ? `?${params.toString()}` : ""}`

  const response = await api.get(url)
  return response.data.results ?? response.data // paginación futura
}

export const getCategories = async (): Promise<Category[]> =>{
  const response = await api.get("/posts/categories/")
  return response.data
}