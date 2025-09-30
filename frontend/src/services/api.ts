import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "@/lib/tokens"

const API_URL = "http://localhost:8000/api"


export const publicApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" }
})

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" }
})

export const refreshClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" }
})


// helper to decode JWT expiration time
function isTokenExpiringSoon(token: string, bufferSeconds = 30): boolean {
  try {
    const payload: any = jwtDecode(token)
    const exp = payload.exp * 1000 // ms
    return exp - Date.now() < bufferSeconds * 1000
  } catch {
    return true // if can't decode, consider it expiring
  }
}

// flag token refresh and queue for requests while refreshing
let isRefreshing = false
let refreshQueue: Array<(token: string | null) => void> = []


async function getValidAccessToken(): Promise<string | null> {
  const access = getAccessToken()
  if (!access) return null

  if (!isTokenExpiringSoon(access)) return access

  if (isRefreshing) {
    return new Promise(resolve => {
      refreshQueue.push(resolve)
    })
  }

  try {
    isRefreshing = true
    const refresh = getRefreshToken()
    if (!refresh) {
      clearTokens()
      return null
    }

    const response = await refreshClient.post("/users/refresh/", { refresh })
    const newAccess = response.data?.access
    const newRefresh = response.data?.refresh

    if (!newAccess || !newRefresh || typeof newAccess !== "string" || typeof newRefresh !== "string") {
      throw new Error("Refresh failed: Access token or Refresh token is missing or invalid")
    }

    setTokens(newAccess, newRefresh)

    // notify all waiting requests
    refreshQueue.forEach(cb => cb(newAccess))
    refreshQueue = []

    return newAccess
  } catch {
    clearTokens()
    refreshQueue.forEach(cb => cb(null))
    refreshQueue = []
    return null
  } finally {
    isRefreshing = false
  }
}

// request interceptor to include the access token in headers
api.interceptors.request.use(async (config) => {
  const token = await getValidAccessToken()
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`
  }
  return config
})

export default api
