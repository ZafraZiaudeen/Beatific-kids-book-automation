import { API_BASE_URL, apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

type AuthImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string;
};

function isApiImageSource(src: string) {
  if (src.startsWith("data:") || src.startsWith("blob:")) {
    return false;
  }

  if (src.startsWith("/api/") || src.startsWith("api/")) {
    return true;
  }

  if (API_BASE_URL && src.startsWith(API_BASE_URL)) {
    return true;
  }

  return src.includes("/api/drive/");
}

export default function AuthImage({ src, ...props }: AuthImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    let retryCount = 0;

    async function loadImage() {
      if (!src) {
        setResolvedSrc("");
        return;
      }

      if (!isApiImageSource(src)) {
        setResolvedSrc(src);
        return;
      }

      try {
        const response = await apiFetch(src);
        if (!response.ok) {
          if (response.status === 401 && retryCount < 1) {
            retryCount += 1;
            setTimeout(() => {
              if (!cancelled) {
                void loadImage();
              }
            }, 300);
            return;
          }
          throw new Error(`Failed to load image: ${response.status}`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) {
          setResolvedSrc(objectUrl);
        }
      } catch (error) {
        if (!cancelled) {
          setResolvedSrc("");
        }
      }
    }

    void loadImage();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (!src || !resolvedSrc) {
    return null;
  }

  return <img src={resolvedSrc} {...props} />;
}
