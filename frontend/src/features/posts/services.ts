import { publicApi } from "@/services/api"
import type { Post, Category } from "@/types/post"

export const getFeaturedPost = async (): Promise<Post> => {
  const response = await publicApi.get("/posts/featured/")
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

  const response = await publicApi.get(url)
  return response.data.results ?? response.data // paginación futura
}

export const getCategories = async (): Promise<Category[]> =>{
  const response = await publicApi.get("/posts/categories/")
  return response.data
}