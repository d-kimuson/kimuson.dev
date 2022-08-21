import { atom } from "recoil"

export const windowSizeState = atom<number>({
  key: "windowSizeState",
  default: new Promise<number>((resolve) => {
    try {
      resolve(window.innerWidth)
    } catch (err) {
      if (!(err instanceof ReferenceError)) {
        throw err
      }
    }
  }),
  // default: process.env.DEV_SSR ? window.innerWidth : -1,
})
