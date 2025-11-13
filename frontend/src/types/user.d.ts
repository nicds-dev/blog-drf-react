export interface UserProfile {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string | null
  bio: string | null
  avatar: string | null
  date_joined: string
  followers_count: number
  following_count: number
  posts_count: number
  is_followed: boolean
}
