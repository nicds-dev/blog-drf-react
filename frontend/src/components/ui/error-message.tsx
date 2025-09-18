import { AlertTriangle } from "lucide-react"

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center p-4 bg-red-500/15 border border-red-500/25 rounded-lg">
        <AlertTriangle className="w-10 text-red-300 me-4" />
        <span className="text-red-300 font-medium">{message}</span>
    </div>
  )
}
