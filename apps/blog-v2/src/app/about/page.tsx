import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { snsUrls } from "@/config/sns";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About This Site</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome to {siteConfig.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This blog serves as a central hub for{" "}
            <a href={snsUrls.twitter}>@_kimuson</a>'s technical writing and
            personal thoughts. Here, you'll find links to my articles from
            various platforms, including:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Technical posts from companies I work(ed) for</li>
            <li>
              Articles published on platforms like{" "}
              <a href="https://zenn.dev/">Zenn</a>
            </li>
            <li>Original content exclusive to this blog</li>
          </ul>
          <p className="mb-4">
            While the primary focus is on technical content, particularly web
            development and software engineering, I also share my thoughts on
            various topics that interest me. You'll find articles about:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Web development techniques and best practices</li>
            <li>Software engineering insights</li>
            <li>Personal reflections and thought processes</li>
          </ul>
          <h3 className="text-xl font-semibold mb-3">Site Features</h3>
          <ul className="list-disc list-inside mb-4">
            <li>
              This site uses Google Analytics to understand reader engagement
              and improve content
            </li>
            <li>
              All articles are version-controlled on GitHub - feel free to check
              the history or suggest improvements
            </li>
            <li>
              Have questions or feedback? Reach out to me via DM on{" "}
              <a href={snsUrls.twitter}>X</a>
            </li>
          </ul>
          <p>
            I'm a firm believer in open knowledge sharing and community-driven
            learning. Your feedback, suggestions, and contributions are always
            welcome and appreciated!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
