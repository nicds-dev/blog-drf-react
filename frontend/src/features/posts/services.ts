import api from "@/services/api"
import type { Post } from "@/types/post"
import type { Category } from "@/types/post"

export const getFeaturedPost = async (): Promise<Post> => {
  const response = await api.get("/posts/featured/")
  return response.data
}

export const getPosts = async (category: string = "all"): Promise<Post[]> => {
  const url = category === "all" ? "/posts/" : `/posts/?category=${category}`

  const response = await api.get(url)
  return response.data.results ?? response.data // paginación futura
}

export const getCategories = async (): Promise<Category[]> =>{
  const response = await api.get("/posts/categories/")
  return response.data
}