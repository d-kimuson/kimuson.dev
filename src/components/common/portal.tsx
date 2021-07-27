import { createPortal } from "react-dom"

type PortalProps = React.PropsWithChildren<Record<string, unknown>>

export const Portal: React.VFC<PortalProps> = ({ children }: PortalProps) => {
  const element =
    typeof window !== "undefined"
      ? document.getElementById("layout-root")
      : null

  return element !== null ? createPortal(children, element) : null
}
