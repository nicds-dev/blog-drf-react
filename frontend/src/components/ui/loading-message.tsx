import { Loader2 } from "lucide-react"

export default function LoadingMessage() {
  return (
    <div className="flex items-center justify-center space-x-2 p-6">
      <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      <span className="text-lg text-muted-foreground">Loading...</span>
    </div>
  )
}
