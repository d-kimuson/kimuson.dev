import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FaGithub, FaStar } from 'react-icons/fa'

// 仮のデータ
const projects = [
  {
    id: 1,
    name: "React Component Library",
    description: "A collection of reusable React components with TypeScript support.",
    stars: 250,
    tags: ["React", "TypeScript", "UI"],
    url: "https://github.com/yourusername/react-component-library"
  },
  {
    id: 2,
    name: "Node.js API Boilerplate",
    description: "A scalable Node.js API boilerplate with Express, MongoDB, and JWT authentication.",
    stars: 180,
    tags: ["Node.js", "Express", "MongoDB"],
    url: "https://github.com/yourusername/nodejs-api-boilerplate"
  },
  {
    id: 3,
    name: "Vue.js Dashboard Template",
    description: "A responsive admin dashboard template built with Vue.js and Tailwind CSS.",
    stars: 320,
    tags: ["Vue.js", "Tailwind CSS", "Dashboard"],
    url: "https://github.com/yourusername/vuejs-dashboard-template"
  }
]

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Open Source Projects</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{project.name}</span>
                <span className="flex items-center text-yellow-400">
                  <FaStar className="mr-1" />
                  {project.stars}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-400">{project.description}</p>
              <div className="mb-4">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="mr-2 mb-2">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" asChild>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <FaGithub className="mr-2" />
                  View on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

