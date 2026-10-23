import { cx } from "../cx";

export type ThumbnailSize = "list" | "sm" | "md" | "tile" | "hero";

/** Product or place image. Without an image it shows the item emoji on a neutral surface. */
export function Thumbnail({ className, fallback = "🍽", size = "md", src }: { className?: string; fallback?: string; size?: ThumbnailSize; src?: string }) {
  return (
    <span aria-hidden="true" className={cx("wa-thumbnail", `wa-thumbnail--${size}`, !src && "wa-thumbnail--placeholder", className)}>
      {src ? <img alt="" src={src} /> : <span className="wa-thumbnail__fallback">{fallback}</span>}
    </span>
  );
}
