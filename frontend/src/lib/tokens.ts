export const ACCESS_TOKEN_KEY = "access"
export const REFRESH_TOKEN_KEY = "refresh"

export const getAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY)
export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY)

export const setTokens = (access: string, refresh: string) => {
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
