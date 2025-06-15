import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { snsUrls } from "@/config/sns";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { HiPresentationChartLine } from "react-icons/hi2";
import { CalendarDays, ExternalLink } from "lucide-react";

const speakingHistory = [
  {
    title:
      "MCP で繋ぐ Figma とデザインシステム〜LLM を使った UI 実装のリアル〜",
    event: "レバテックLAB開発チームイベント",
    date: "2025年5月28日",
    url: "https://speakerdeck.com/kimuson/mcp-dexi-gu-figma-todezainsisutemu-llm-woshi-tuta-ui-shi-zhuang-noriaru",
  },
  {
    title: "TypeScript へ型安全性を高めながらリプレースする",
    event: "Yet Another Perl Conference 2022",
    date: "2022年3月4日",
    url: "https://speakerdeck.com/kimuson/typescript-hexing-an-quan-xing-wogao-menagararipuresusuru",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-6">About</h1>

      {/* Profile Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About kimuson</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-32 h-32">
                <AvatarImage src="/profile.jpg" alt="Profile Picture" />
                <AvatarFallback className="text-2xl">KS</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold mb-2">kimuson</h2>
              <p className="text-muted-foreground mb-4">
                Software Engineer passionate about web technologies
              </p>
              <p className="mb-4 leading-relaxed">
                I&apos;m a software engineer with expertise in TypeScript and
                the Node.js ecosystem. I enjoy building modern web applications
                and sharing knowledge about web development techniques, best
                practices, and emerging technologies.
              </p>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">
                  Technologies I work with:
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">Django</Badge>
                  <Badge variant="secondary">PostgreSQL</Badge>
                  <Badge variant="secondary">Docker</Badge>
                </div>
              </div>

              <div className="flex space-x-4">
                <a
                  href={snsUrls.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <FaGithub className="text-xl" />
                  <span>GitHub</span>
                </a>
                <a
                  href={snsUrls.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <FaTwitter className="text-xl" />
                  <span>Twitter</span>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Speaking History */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HiPresentationChartLine className="text-xl" />
            Speaking & Presentations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {speakingHistory.map((talk, index) => (
              <div
                key={index}
                className="border border-border/20 rounded-lg p-4 hover:border-border/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-lg leading-tight">
                    {talk.title}
                  </h3>
                  <a
                    href={talk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                  >
                    <span className="text-sm">View Slides</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>{talk.date}</span>
                  </div>
                  <div className="hidden sm:block">•</div>
                  <div>{talk.event}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Site Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About This Site</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This blog serves as a central hub for my technical writing and
            personal thoughts. Here, you&apos;ll find links to my articles from
            various platforms, including:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Technical posts from companies I work(ed) for</li>
            <li>
              Articles published on platforms like{" "}
              <a
                href="https://zenn.dev/"
                className="text-primary hover:underline"
              >
                Zenn
              </a>
            </li>
            <li>Original content exclusive to this blog</li>
          </ul>
          <p className="mb-4">
            While the primary focus is on technical content, particularly web
            development and software engineering, I also share my thoughts on
            various topics that interest me. You&apos;ll find articles about:
          </p>
          <ul className="list-disc list-inside mb-6 space-y-1">
            <li>Web development techniques and best practices</li>
            <li>Software engineering insights</li>
            <li>Personal reflections and learning experiences</li>
            <li>Technology trends and observations</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Site Features</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Built with Next.js and TypeScript for optimal performance</li>
            <li>
              All articles are version-controlled on GitHub - feel free to check
              the history or suggest improvements
            </li>
            <li>Responsive design optimized for all devices</li>
            <li>Search and filter functionality to find relevant content</li>
          </ul>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Have questions or feedback?</strong> Feel free to reach
              out via{" "}
              <a
                href={snsUrls.twitter}
                className="text-primary hover:underline"
              >
                Twitter DM
              </a>{" "}
              or check out my projects on{" "}
              <a href={snsUrls.github} className="text-primary hover:underline">
                GitHub
              </a>
              . I&apos;m always happy to discuss technology, share knowledge,
              and connect with fellow developers!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
