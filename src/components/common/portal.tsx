import { createPortal } from "react-dom"

type PortalProps = React.PropsWithChildren<Record<string, unknown>>

export const Portal: React.VFC<PortalProps> = ({ children }: PortalProps) => {
  const element = document.getElementById("layout-root")

  return element !== null ? createPortal(children, element) : null
}
