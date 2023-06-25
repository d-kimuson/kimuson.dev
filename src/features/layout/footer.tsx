import type { FunctionalComponent } from "preact";
import { footerHeight, px } from "~/features/layout/config";

type FooterProps = Record<string, never>;

export const Footer: FunctionalComponent<FooterProps> = () => {
  return (
    <footer
      style={{
        height: px(footerHeight),
      }}
      className="flex items-center justify-center bg-theme-strong text-theme-reversed"
    >
      <h2>{`© 2020-${new Date().getFullYear()} kimuson.dev All Right Reserved.`}</h2>
    </footer>
  );
};
