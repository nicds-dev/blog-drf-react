import { NavLink } from "react-router-dom"

export default function NavLinks() {
  const navItems = [
    { name: "Home", to: "/" },
    { name: "Explore", to: "/explore" }
  ]

  return (
    <nav className="hidden md:flex gap-6">
      {navItems.map((item) => (
        <NavLink 
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `hover:text-blue-500 transition-all duration-300 relative group ${
              isActive ? "text-blue-500" : "text-muted-foreground"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {item.name}
              <span
                className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 transform transition-all duration-300 ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </>
          )}
        </NavLink >
      ))}
    </nav>
  )
}