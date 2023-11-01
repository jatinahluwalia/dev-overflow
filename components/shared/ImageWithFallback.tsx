"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface Props extends ImageProps {
  fallbackUrl?: string;
}

const ImageWithFallback = ({
  fallbackUrl = "/assets/icons/suitcase.svg",
  width,
  height,
  src,
  alt,
  ...props
}: Props) => {
  const [Src, setSrc] = useState(src || fallbackUrl);
  useEffect(() => {
    if (
      typeof src === "string" &&
      src.startsWith("https://lookaside.fbsbx.com/")
    )
      setSrc(fallbackUrl);
  }, [src, fallbackUrl]);

  return (
    <Image
      width={width}
      height={height}
      alt={alt}
      src={Src}
      onErrorCapture={() => setSrc(fallbackUrl)}
      {...props}
    />
  );
};

export default ImageWithFallback;
