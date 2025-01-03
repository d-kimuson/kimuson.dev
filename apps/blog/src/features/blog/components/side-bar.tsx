import type { BlogPropsSchema } from "../schemas/blog-props.schema";
import type { FunctionalComponent } from "preact";
import { headerHeight, px } from "../../layout/config";
import { Toc } from "../components/toc";

type SideBarProps = {
  headings: BlogPropsSchema["headings"];
};

export const SideBar: FunctionalComponent<SideBarProps> = ({ headings }) => {
  return (
    <section className="relative hidden md:flex md:w-[300px] md:flex-col md:items-center">
      <div className="sticky w-full" style={{ top: px(headerHeight) }}>
        <Toc headings={headings} />
      </div>
    </section>
  );
};
