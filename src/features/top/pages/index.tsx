import type { FunctionalComponent } from "preact";
import { Image } from "~/features/base/image";
import { Card } from "~/features/top/components/card";

type IndexPageProps = Record<string, never>;

export const IndexPage: FunctionalComponent<IndexPageProps> = () => {
  return (
    <main className="text-theme-reversed flex flex-col">
      <Card title="About Me" className="m-5">
        <div className="p-5">
          <Image
            className="rounded-full"
            src="/assets/profile.jpg"
            alt="kimuson"
            width="200px"
            aspectRatio={{
              height: 1,
              width: 1,
            }}
          />
          <p>ソフトウェアエンジニアです。</p>
          <p>Web 周りの技術に興味があります。</p>
          <p>特に TypeScript / Node.js 周りのエコシステムが好きです。</p>
        </div>
      </Card>

      <ul className="flex mx-5 mb-5">
        <li>
          <Card title="記事一覧" href="/blog" className="px-10 py-7" />
        </li>
        {[
          {
            text: "Github",
            href: "https://github.com/d-kimuson",
          },

          { text: "Twitter", href: "https://twitter.com/_kimuson" },
          {
            text: "SpeakerDeck",
            href: "https://speakerdeck.com/kimuson",
          },
          { text: "Zenn", href: "https://zenn.dev/kimuson" },
        ].map(({ href, text }) => (
          <Card key={href} title={text} href={href} className="px-10 py-7" />
        ))}
      </ul>
    </main>
  );
};
