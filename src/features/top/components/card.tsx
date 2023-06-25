import classNames from "classnames";
import type { FunctionalComponent, JSX } from "preact";

export type CardProps = {
  className?: string;
  title: string;
  href?: string;
  children?: JSX.Element;
};

export const Card: FunctionalComponent<CardProps> = ({
  title,
  href,
  children,
  className,
}) => {
  const content = (
    <section
      className={classNames(className, "flex flex-col border-white border-2")}
    >
      <h3>{title}</h3>
      {children !== undefined ? <>{children}</> : null}
    </section>
  );

  return href === undefined ? content : <a href={href}>{content}</a>;
};
