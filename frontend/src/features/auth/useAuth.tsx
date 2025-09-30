import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { jwtDecode } from "jwt-decode"
import { loginApi, signUpApi, refreshTokenApi, logoutApi } from "./authService"
import { setTokens, getAccessToken, clearTokens } from "@/lib/tokens"
import type { LoginData, SignUpData } from "@/types/auth"
import { toast } from "sonner"


interface AuthContextType {
  isAuthenticated: boolean
  loginUser: (data: LoginData) => Promise<void>
  signUpUser: (data: SignUpData) => Promise<void>
  logoutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [rehydrating, setRehydrating] = useState(true)

  useEffect(() => {
    let isMounted = true
    const tryRehydrate = async () => {
      const access = getAccessToken()
      if (!access) {
        setRehydrating(false) // no token, still not authenticated
        return
      }

      try {
        const payload: any = jwtDecode(access)

        // if token expired, try refresh
        if (payload.exp * 1000 < Date.now()) {
          try {
            const tokens = await refreshTokenApi()
            setTokens(tokens.access, tokens.refresh)
            if (!isMounted) return
            setIsAuthenticated(true)
          } catch (error) {
            clearTokens()
            setIsAuthenticated(false)
          } finally {
            setRehydrating(false)
          }
        } else {
          // if token still valid
          setIsAuthenticated(true)
          setRehydrating(false)
        }
      } catch {
        // token corrupted or invalid
        clearTokens()
        setIsAuthenticated(false)
        setRehydrating(false)
      }
    }

    tryRehydrate()
    return () => { isMounted = false }
  }, [])

  const loginUser = async (data: LoginData) => {
    try {
      const tokens = await loginApi(data)
      if (!tokens?.access || !tokens?.refresh) throw new Error("Login failed: Tokens missing")
      setTokens(tokens.access, tokens.refresh)
      toast.success("Login successful")
      setIsAuthenticated(true)
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? error.message ?? "Login failed")
      throw error
    }
  }

const signUpUser = async (data: SignUpData) => {
  try {
    await signUpApi(data)
    toast.success("Account created successfully")
  } catch (error: any) {
    // error response contains field-specific errors
    if (error?.response?.data && typeof error.response.data === "object") {
      const errors = error.response.data

      // show each field and message(s)
      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg) => toast.error(`${field}: ${msg}`))
        } else if (typeof messages === "string") {
          toast.error(`${field}: ${messages}`)
        }
      })
    }
    // if a generic `detail` message is returned
    else if (error?.response?.data?.detail) {
      toast.error(error.response.data.detail)
    }
    else {
      toast.error(error.message ?? "Sign up failed")
    }
    throw error
  }
}

  const logoutUser = async () => {
    try {
      await logoutApi()
    } catch (error: any) {
      toast.error(error?.response?.data?.detail ?? error.message ?? "Logout failed")
    } finally {
      clearTokens()
      setIsAuthenticated(false)
      toast.success("Logged out successfully")
    }
  }
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, loginUser, signUpUser, logoutUser }}>
      { !rehydrating ? children: <div className="p-4 text-center">Loading...</div> }
    </AuthContext.Provider>
  )
}


// custom hook to use the auth contextS
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}