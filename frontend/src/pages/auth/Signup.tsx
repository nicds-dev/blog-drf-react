import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/useAuth"
import FormField from "./FormField"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export default function SignupPage() {
  const { signUpUser } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    first_name: "", last_name: "", email: "", username: "", password: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signUpUser(formData)
      navigate("/login")
    } finally {
      setLoading(false)
    }
    
  }

  return (
    <div className="container py-12 flex justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Create an account</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 pb-6">
            <div className="flex gap-4">
              <FormField
                onChange={handleChange}
                id="first_name"
                label="First Name"
                type="text"
                placeholder="First Name"
                required
              />
              <FormField
                onChange={handleChange}
                id="last_name"
                label="Last Name"
                type="text"
                placeholder="Last Name"
                required
              />
            </div>
            <FormField
              onChange={handleChange}
              id="email"
              label="Email"
              type="email"
              placeholder="name@example.com"
              required
            />
            <FormField
              onChange={handleChange}
              id="username"
              label="Username"
              type="text"
              placeholder="Your username"
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
              {loading ? "Signing up..." : "Sign up"}
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <NavLink to="/login" className="text-blue-500 hover:text-violet-700/80">
                Log in
              </NavLink>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
