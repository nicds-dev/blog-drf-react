import { useState } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/useAuth"
import FormField from "./FormField"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export default function LoginPage() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await loginUser({ ...formData, username: formData.username.toLowerCase() })
      await new Promise(resolve => setTimeout(resolve, 50))

      const from = location.state?.from?.pathname || "/"
      navigate(from, { replace: true }) // Redirect to the page user intended to visit or home
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12 flex justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 pb-6">
            <FormField
              onChange={handleChange}
              id="username"
              label="Username"
              type="text"
              placeholder="Enter your username"
              required
            />
            <FormField
              onChange={handleChange}
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              required
              showPasswordToggle={true}
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">
              {loading ? "Logging in..." : "Log in"}
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don&apost have an account?{" "}
              <NavLink to="/signup" className="text-blue-500 hover:text-violet-700/80">
                Sign up
              </NavLink>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
