import type { FunctionalComponent } from "preact"
import { headerHeight, px } from "~/features/layout/config"

type HeaderProps = Record<string, never>

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
        <ul>
          <a href="/blog" className="hover:font-bold">
            BLOG
          </a>
        </ul>
      </nav>
    </header>
  )
}
