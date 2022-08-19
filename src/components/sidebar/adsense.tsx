import React, { useEffect } from "react"

export const Adsense: React.VFC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (typeof window.adsbygoogle !== "undefined") {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- 覚えてないけどわざわざ書いてるってことは必要なんやろ...
          window.adsbygoogle = window.adsbygoogle ?? []
          window.adsbygoogle.push({})
        } catch (_err) {
          // skip
        }
      }
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      data-ad-client="ca-pub-4665963407721538"
      data-ad-slot="9834758301"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
