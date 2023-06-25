import type { FunctionComponent, JSX } from "preact"

type CardProps = {
  title: string
  children: JSX.Element
}

export const Card: FunctionComponent<CardProps> = ({ title, children }) => (
  <div>
    <h2 className="bg-theme-strong">{title}</h2>
    <section className="bg-theme-weak">{children}</section>
  </div>
)
