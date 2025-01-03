import classNames from "classnames";
import type { FunctionalComponent, JSX } from "preact";

export const Label: FunctionalComponent<{
  className?: string;
  children: JSX.Element | string | string[];
}> = ({ children, className }) => (
  <span
    className={classNames("rounded-md bg-gray px-2 py-1 text-white", className)}
  >
    {children}
  </span>
);
