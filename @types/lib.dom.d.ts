// declare global {
//   interface Window {
//     myProp: MyProp
//   }
// }
// declare global {
//   var window: Window
// }

interface Window {
  adsbygoogle:
    | {
        loaded: boolean
        push: (option: any) => void
      }
    | undefined
}

// declare global {
//   interface Window {
//     adsbygoogle?: {
//       loaded: boolean
//       push: () => void
//     }
//   }
// }

// declare global {
//   var window: Window
// }

// declare var window: Window
