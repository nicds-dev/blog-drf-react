import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getCategories } from "../services"
import type { Category } from "@/types/post"

interface CategoryFilterProps {
  setCategory: (category: string) => void
  currentCategory: string
}

export default function CategoryFilter ({ setCategory, currentCategory }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category => (
        <Button
          key={category.slug}
          variant={currentCategory === category.slug ? "secondary" : "outline"}
          className="rounded-full"
          onClick={() => setCategory(category.slug)}
        >
          {category.name}
        </Button>
      )))}
    </div>
  ) 
}