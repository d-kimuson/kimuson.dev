import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const Header = () => {
  return (
    <header className="bg-gray-800 h-header">
      <nav className="container mx-auto px-4 h-full flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          {siteConfig.title}
        </Link>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/blog">Blog</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/projects">Projects</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
