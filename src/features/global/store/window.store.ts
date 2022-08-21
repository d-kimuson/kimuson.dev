import { atom } from "recoil"
// import type { Loadable } from "~/utils/loadable"
// import { loading } from "~/utils/loadable"

export const windowSizeState = atom<number>({
  key: "windowSizeState",
  default: window.innerWidth,
})
