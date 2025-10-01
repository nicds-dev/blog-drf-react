import api, { publicApi, refreshClient } from "@/services/api"
import { getRefreshToken } from "@/lib/tokens"
import type { SignUpData, LoginData, TokenResponse, UserProfile } from "@/types/auth"

export const signUpApi = async (data: SignUpData): Promise<UserProfile> => {
  const response = await api.post("/users/signup/", data)
  return response.data
}

export const loginApi = async (data: LoginData) => {
  const response = await api.post("/users/login/", data)
  return response.data as TokenResponse
}

export const refreshTokenApi = async (refresh?: string): Promise<TokenResponse> => {
  const token = refresh ?? getRefreshToken()
  if (!token) throw new Error("No refresh token available")
  const response = await refreshClient.post("/users/refresh/", { refresh: token })
  return response.data
}

export const logoutApi = async (refresh?: string): Promise<void> => {
  const token = refresh ?? getRefreshToken()
  if (!token) return
  await publicApi.post("/users/logout/", { refresh: token })
}
