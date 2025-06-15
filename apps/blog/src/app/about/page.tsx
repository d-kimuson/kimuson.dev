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
                Web技術を愛するソフトウェアエンジニア
              </p>
              <p className="mb-4 leading-relaxed">
                TypeScriptとNode.jsエコシステムを専門とするソフトウェアエンジニアです。
                モダンなWebアプリケーションの構築を楽しんでおり、
                Web開発技術、ベストプラクティス、新しい技術について知識を共有することを大切にしています。
              </p>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">扱っている技術：</h3>
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
            Speaking
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
                    <span className="text-sm">スライドを見る</span>
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
            私の技術記事や考えをまとめたブログです。
            様々なプラットフォームで公開した記事もここから確認できます：
          </p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>現在・過去の勤務先企業の技術記事</li>
            <li>
              <a
                href="https://zenn.dev/"
                className="text-primary hover:underline"
              >
                Zenn
              </a>
              などのプラットフォームで公開した記事
            </li>
            <li>このブログ限定のオリジナルコンテンツ</li>
          </ul>
          <p className="mb-4">
            Web開発やソフトウェアエンジニアリングを中心とした技術記事が主ですが、
            興味のあるトピックについても書いています：
          </p>
          <ul className="list-disc list-inside mb-6 space-y-1">
            <li>Web開発技術とベストプラクティス</li>
            <li>ソフトウェアエンジニアリングの洞察</li>
            <li>個人的な振り返りと学習経験</li>
            <li>技術トレンドと所感</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Site Features</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Next.jsとTypeScriptで高速なサイトを実現</li>
            <li>記事はGitHubで管理しており、履歴や改善提案が可能</li>
            <li>スマホ、タブレット、PCに対応したレスポンシブデザイン</li>
            <li>記事を簡単に探せる検索・フィルター機能</li>
          </ul>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>何かご質問やフィードバックはありますか？</strong>{" "}
              <a
                href={snsUrls.twitter}
                className="text-primary hover:underline"
              >
                Twitter DM
              </a>
              でお気軽にお声がけいただくか、
              <a href={snsUrls.github} className="text-primary hover:underline">
                GitHub
              </a>
              で作品をご覧ください。
              技術について語り合い、知識を共有できれば嬉しいです！
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
