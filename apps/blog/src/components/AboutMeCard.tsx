import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AboutMeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Me</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar className="w-32 h-32 mb-4">
          <AvatarImage src="/profile.jpg" alt="Profile Picture" />
          <AvatarFallback>kimuson</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold mb-2">kimuson</h2>
        <p className="text-center text-gray-400 mb-4">
          Software engineer interested in web technologies with expertise in
          TypeScript and Node.js.
        </p>
        <div className="flex space-x-4">
          <Button variant="outline" size="sm">
            <Link href="/about">More Details</Link>
          </Button>
          <Button variant="outline" size="sm">
            <Link href="/projects">My Projects</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
