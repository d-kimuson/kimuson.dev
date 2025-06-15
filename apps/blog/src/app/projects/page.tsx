import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaGithub, FaStar, FaCode, FaExternalLinkAlt } from "react-icons/fa";
import { getAllProjects } from "@kimuson.dev/articles";

const projects = getAllProjects();

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
          🚀 Open Source Projects
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          私が開発・メンテナンスしているオープンソースプロジェクトをご紹介します。
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <Card
            key={`${project.owner}-${project.name}`}
            className="group h-full bg-card/60 backdrop-blur-sm border-border/40 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={`https://github.com/${project.owner}.png`}
                      alt={project.owner}
                    />
                    <AvatarFallback>
                      <FaCode className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200">
                      {project.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      by {project.owner}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-400/20"
                >
                  <FaStar className="mr-1 h-3 w-3" />
                  {project.stars}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-5">
              <p className="text-muted-foreground leading-relaxed line-clamp-4">
                {project.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 border-blue-400/20"
                >
                  OSS
                </Badge>

                <Button
                  size="sm"
                  variant="ghost"
                  className="group/btn hover:bg-primary/10 hover:text-primary"
                  asChild
                >
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <FaGithub className="h-4 w-4" />
                    <span>GitHub</span>
                    <FaExternalLinkAlt className="h-3 w-3 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">
            プロジェクトが見つかりません
          </h3>
          <p className="text-muted-foreground">
            現在表示できるプロジェクトがありません。
          </p>
        </div>
      )}
    </div>
  );
}
