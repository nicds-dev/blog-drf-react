export interface Author {
  id: number
  username: string
  full_name: string
  avatar: string | null
  is_followed?: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Hashtag {
  id: number
  name: string
}

export interface Post {
  id: number
  slug: string
  title: string
  content: string
  image: string | null
  author: Author
  category: Category | null
  hashtags: Hashtag[]
  likes_count: number
  is_liked?: boolean
  created_at: string
}
