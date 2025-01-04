import { AboutMeCard } from "@/components/AboutMeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { snsUrls } from "@/config/sns";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to kimuson.dev</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                Welcome to <a href={snsUrls.twitter}>@_kimuson</a>'s personal
                blog site.
              </p>
              <p className="mb-2">
                Here, I share technical articles and daily learnings focused on
                web technologies, particularly the Node.js ecosystem including
                TypeScript.
              </p>
              <p>
                This site serves as a hub that not only features my original
                posts but also links to articles I've written for company tech
                blogs (current and previous employers) and other platforms.
              </p>
            </div>
            <div className="flex gap-4 mt-4">
              <Button asChild>
                <Link href="/blog">See Articles</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">About this site</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <AboutMeCard />
      </div>
    </div>
  );
}
