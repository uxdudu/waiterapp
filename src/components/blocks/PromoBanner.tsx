import type { ReactNode } from "react";
import { Tag } from "../base";
import { cx } from "../cx";

/** Highlighted offer with a tag, short copy, one action and an image. */
export function PromoBanner({ action, description, image, tag, title, tone = "brand" }: { action: ReactNode; description: ReactNode; image: string; tag: string; title: string; tone?: "brand" | "success" }) {
  return (
    <article className={cx("wa-promo-banner", `wa-promo-banner--${tone}`)}>
      <div className="wa-promo-banner__copy">
        <Tag tone="inverse">{tag}</Tag>
        <h2>{title}</h2>
        <p>{description}</p>
        {action}
      </div>
      <img alt="" className="wa-promo-banner__image" src={image} />
    </article>
  );
}
