import api, { publicApi } from "@/services/api"
import { getAccessToken, getRefreshToken } from "@/lib/tokens"
import type { Post, Category, ToggleLike } from "@/types/post"

const getApiClient = () => {
  return getAccessToken() && getRefreshToken() ? api : publicApi
}

export const getFeaturedPost = async (): Promise<Post> => {
  const apiToUse = getApiClient()
  const response = await apiToUse.get("/posts/featured/")
  return response.data
}

export const getPosts = async (filters?: {
  category?: string
  author?: string
  hashtag?: string
  title?: string
}): Promise<Post[]> => {
  const params = new URLSearchParams()

  if (filters?.category && filters.category !== "all") {
    params.append("category", filters.category)
  }
  if (filters?.author) {
    params.append("author", filters.author)
  }
  if (filters?.hashtag) {
    params.append("hashtag", filters.hashtag)
  }
  if (filters?.title && filters.title.trim()) {
    params.append("search", filters.title.trim())
  }

  const url = `/posts/${params.toString() ? `?${params.toString()}` : ""}`

  const apiToUse = getApiClient()
  const response = await apiToUse.get(url)
  return response.data.results ?? response.data // paginación futura
}

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const response = await api.get(`/posts/${slug}/`)
  return response.data
}

export const toggleLike = async (slug: string): Promise<ToggleLike> => {
  const response = await api.post(`/posts/${slug}/toggle-like/`)
  return response.data
}

export const getCategories = async (): Promise<Category[]> =>{
  const response = await publicApi.get("/posts/categories/")
  return response.data
}