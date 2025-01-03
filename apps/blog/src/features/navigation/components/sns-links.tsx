import classNames from "classnames";
import type { FunctionComponent } from "preact";
import { ExternalLink } from "~/ui/external-link";

type SnsLinkConfig = {
  name: string;
  url: `https://${string}`;
};

type SnsLinksProps = {
  className?: string;
};

const snsConfigList: SnsLinkConfig[] = [
  {
    name: "Twitter",
    url: "https://twitter.com/_kimuson",
  },
  {
    name: "Github",
    url: "https://github.com/d-kimuson",
  },
  {
    name: "Zenn",
    url: "https://zenn.dev/kimuson",
  },
  {
    name: "SpeakerDeck",
    url: "https://speakerdeck.com/kimuson",
  },
];

export const SnsLinks: FunctionComponent<SnsLinksProps> = ({ className }) => (
  <div className={classNames(className, "w-full flex flex-col items-center")}>
    <h2 className="text-xl">SNS Links</h2>

    <ul>
      {snsConfigList.map((snsConfig) => (
        <li key={snsConfig.name}>
          <ExternalLink href={snsConfig.url}>{snsConfig.name}</ExternalLink>
        </li>
      ))}
    </ul>
  </div>
);
