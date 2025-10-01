import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface FormFieldProps {
  id: string
  label: string
  type: string
  placeholder: string
  required: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showPasswordToggle?: boolean
}

export default function FormField({
  id,
  label,
  type,
  placeholder,
  required,
  onChange,
  showPasswordToggle = false,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="space-y-8">
      <label htmlFor={id} className="text-xs font-medium">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={showPasswordToggle && showPassword ? "text" : type}
          placeholder={placeholder}
          required={required}
          className={showPasswordToggle ? "pr-10" : ""}
          onChange={onChange}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-muted-foreground"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  )
}