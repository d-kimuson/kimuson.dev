import React from "react"
import Highlight, { defaultProps, Language } from "prism-react-renderer"
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live"

interface CodeProps {
  codeString: string
  language: Language
  "react-live"?: boolean
}

export const Code: React.FC<CodeProps> = ({
  codeString,
  language,
  ...props
}: CodeProps) => {
  if (props[`react-live`]) {
    return (
      <LiveProvider code={codeString} noInline={true}>
        <LiveEditor />
        <LiveError />
        <LivePreview />
      </LiveProvider>
    )
  } else {
    return (
      <Highlight {...defaultProps} code={codeString} language={language}>
        {({
          className,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }): React.ReactNode => (
          <pre className={className} style={style}>
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
    )
  }
}
