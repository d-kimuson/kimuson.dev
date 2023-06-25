import type { FunctionalComponent } from "preact"
import { Toc } from "~/features/blog/components/toc"
import type { BlogPropsSchema } from "~/features/blog/schemas/blog-props.schema"
import { headerHeight, px } from "~/features/layout/config"

type SideBarProps = {
  headings: BlogPropsSchema["headings"]
}

export const SideBar: FunctionalComponent<SideBarProps> = ({ headings }) => {
  return (
    <section className="relative hidden md:flex md:w-[300px] md:flex-col md:items-center">
      <div className="sticky w-full" style={{ top: px(headerHeight) }}>
        <Toc headings={headings} />
      </div>
    </section>
  )
}
