import React from "react"
import { Link } from "gatsby"

const navRoutes = [
  {
    to: `/`,
    text: `TOP`
  }
]

const Navigation: React.FC = () => {
  return (
    <nav role="navigation">
      <ul>
        {navRoutes.map(route => (
          <li key={route.text}>
            <Link to={route.to}>{route.text}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
