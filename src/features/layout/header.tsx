import type { FunctionalComponent } from "preact";
import { headerHeight, px } from "./config";

type HeaderProps = Record<string, never>;

const menus = [
  {
    href: "/blog",
    content: "BLOG",
  },
  {
    href: "/rss.yml",
    content: "FEED",
  },
] as const;

export const Header: FunctionalComponent<HeaderProps> = () => {
  return (
    <header
      style={{ height: px(headerHeight) }}
      className="fixed left-0 top-0 z-10 flex w-full bg-[rgba(23,25,32,.9)] text-white backdrop-blur-[6px]"
    >
      <h1 className="flex items-center justify-center pl-3 text-2xl">
        <a href="/">KIMUSON.DEV</a>
      </h1>

      <nav className="flex w-full items-center justify-end pr-3">
        <ul className="flex">
          {menus.map((menu) => (
            <li className="[&:not(:first-child)]:pl-2" key={menu.href}>
              <a href={menu.href} className="hover:font-bold">
                {menu.content}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
