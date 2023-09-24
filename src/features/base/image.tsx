import classNames from "classnames";
import type { FunctionComponent } from "preact";

export type ImageProps = {
  className?: string;
  src: string;
  alt?: string;
  width?: `${number}px` | `${number}%`;
  aspectRatio: {
    height: number;
    width: number;
  };
};

export const Image: FunctionComponent<ImageProps> = ({
  src,
  alt,
  aspectRatio,
  width,
  className,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      height={`${aspectRatio.height}px`}
      width={`${aspectRatio.width}px`}
      className={classNames(className)}
      style={{
        height: "auto",
        width: width ?? "auto",
      }}
    />
  );
};
