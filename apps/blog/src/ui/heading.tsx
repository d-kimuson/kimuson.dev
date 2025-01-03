import type { FunctionComponent, JSX } from "preact";
import { exhaustiveCheck } from "~/lib/utils/exhaustive-check";

type Size = "h1" | "h2" | "h3";

type HeadingProps = {
  children: JSX.Element | string;
  size?: Size;
};

const sizeToSelector = (size: Size): string => {
  switch (size) {
    case "h1":
      return "text-2xl";
    case "h2":
      return "text-xl";
    case "h3":
      return "text-lg";
    default: {
      return exhaustiveCheck(size);
    }
  }
};

export const Heading: FunctionComponent<HeadingProps> = ({
  size = "h2",
  children,
}) => <span className={sizeToSelector(size)}>{children}</span>;
