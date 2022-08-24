import Highlight, { defaultProps } from "prism-react-renderer"
import dracula from "prism-react-renderer/themes/dracula"
import React, { useState } from "react"
import type { Language } from "prism-react-renderer"
import type { MouseEvent } from "react"
import { replaceAll, copy } from "~/utils/index"
import * as styles from "./code.module.scss"

type CodeProps = {
  codeString: string
  language: Language
  title: string | undefined
  "react-live"?: boolean
}

export const Code: React.FC<CodeProps> = ({ codeString, language, title }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = (event: MouseEvent): void => {
    if (language === `bash`) {
      // bash ブロックの `$ some command` では、`$ ` をコピー対象から外す
      copy(replaceAll(codeString, `$ `, ``))
    } else {
      copy(codeString)
    }
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1000)
    event.preventDefault()
  }

  return (
    <div>
      {/* @ts-expect-error -- React18 未対応 */}
      <Highlight
        {...defaultProps}
        code={codeString}
        language={language}
        theme={dracula}
      >
        {({
          className,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }): React.ReactNode => (
          <pre className={`${className} ${styles.preCodeBlock}`} style={style}>
            {title || language !== `markup` ? (
              <div className={styles.codeBlockTitle}>
                {title ? title : language}
              </div>
            ) : null}
            <button onClick={handleCopy} className={styles.copyButton}>
              {isCopied ? `👍 ` : `COPY`}
            </button>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })} key={i}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} key={key} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
