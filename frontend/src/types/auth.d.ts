export interface TokenResponse {
  access: string
  refresh: string
}

export interface SignUpData {
  email: string
  username: string
  first_name: string
  last_name?: string
  password: string
}

export interface LoginData {
  username: string
  password: string
}

export interface RegisteredUser {
  email: string
  username: string
  first_name: string
}
