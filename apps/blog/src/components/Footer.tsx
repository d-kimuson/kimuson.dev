import { siteConfig } from "@/config/site";
import { snsUrls } from "@/config/sns";
import { FaGithub, FaTwitter } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-card/80 backdrop-blur-lg border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              About kimuson
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Software engineer passionate about web technologies, specializing
              in TypeScript and Node.js ecosystem. Sharing technical insights
              and learning experiences.
            </p>
            <div className="flex space-x-4">
              <a
                href={snsUrls.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-200"
              >
                <FaGithub className="text-xl hover:text-primary" />
              </a>
              <a
                href={snsUrls.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-200"
              >
                <FaTwitter className="text-xl hover:text-accent" />
              </a>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-3">Navigation</h3>
            <div className="space-y-2">
              <Link
                href="/blog"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Blog Articles
              </Link>
              <Link
                href="/projects"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/about"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                About This Site
              </Link>
            </div>
          </div>

          {/* Contact Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Feel free to reach out on social media or check out my work on
              GitHub.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground">
            © 2023-{new Date().getFullYear()} {siteConfig.title}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
