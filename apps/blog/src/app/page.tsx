import { HeroBanner } from "@/components/HeroBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { snsUrls } from "@/config/sns";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Content Section */}
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border-border/50 bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome to kimuson.dev
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                <p className="mb-2">
                  Welcome to{" "}
                  <a
                    href={snsUrls.twitter}
                    className="text-primary hover:underline"
                  >
                    @_kimuson
                  </a>
                  &apos;s personal blog site.
                </p>
                <p className="mb-2">
                  Here, I share technical articles and daily learnings focused
                  on web technologies, particularly the Node.js ecosystem
                  including TypeScript.
                </p>
                <p>
                  This site serves as a hub that not only features my original
                  posts but also links to articles I&apos;ve written for company
                  tech blogs (current and previous employers) and other
                  platforms.
                </p>
              </div>
              <div className="flex gap-4 mt-6">
                <Button
                  asChild
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <Link href="/blog">See Articles</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <Link href="/about">About this site</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
