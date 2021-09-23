import React, { useEffect } from "react"

export const Adsense: React.VFC = () => {
  useEffect(() => {
    if (typeof window !== undefined) {
      if ("adsbygoogle" in window) {
        // @ts-expect-error
        window.adsbygoogle = window.adsbygoogle || []
        // @ts-expect-error
        window.adsbygoogle.push({})
      }
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      data-ad-client="ca-pub-xxxxxxxxxxxxxxx"
      data-ad-slot="xxxxxxxx"
      data-ad-format="auto"
    />
  )
}
