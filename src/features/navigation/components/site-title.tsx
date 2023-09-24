import type { FunctionComponent } from "preact";

type SiteTitleProps = Record<string, never>;

export const SiteTitle: FunctionComponent<SiteTitleProps> = () => (
  <h1 className="text-2xl w-full flex flex-col items-center">KIMUSON.DEV</h1>
);
