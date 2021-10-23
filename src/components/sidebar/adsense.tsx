import React, { useEffect } from "react"

export const Adsense: React.VFC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (typeof window.adsbygoogle !== "undefined") {
        try {
          window.adsbygoogle = window.adsbygoogle || []
          window.adsbygoogle.push({})
        } catch (error) {
          console.warn("Fail to load google adsense")
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
