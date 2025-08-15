import { useLocation } from "react-router-dom"

export default function NavLinks() {

  const location = useLocation()

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" }
  ]

  return (
    <nav className="hidden md:flex gap-6">
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`hover:text-blue-400 transition-all duration-300 relative group ${
            isActive(item.href) ? "text-blue-400" : "text-muted-foreground"
          }`}
        >
          {item.name}
          <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 transform transition-all duration-300 ${
            isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`} />
        </a>
      ))}
    </nav>
  )
}