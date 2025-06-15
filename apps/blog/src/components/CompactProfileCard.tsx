import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Twitter } from "lucide-react";
import { snsUrls } from "@/config/sns";

export function CompactProfileCard() {
  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src="/profile.jpg" alt="Profile Picture" />
            <AvatarFallback>KS</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">kimuson</h3>
            <p className="text-xs text-muted-foreground">Software Engineer</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          Web tech enthusiast focused on TypeScript & Node.js ecosystem
        </p>

        <div className="flex space-x-2 mb-3">
          <a
            href={snsUrls.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-accent/50 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={snsUrls.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-accent/50 transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </div>

        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href="/about">More About Me</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
