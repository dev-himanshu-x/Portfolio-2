import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/utils";

type Props<T extends ElementType> = { as?: T } & ComponentProps<T>;

/** Display heading set in the outline face (size comes from `text-display`). */
export function OutlineText<T extends ElementType = "h2">({
  as,
  className,
  ...props
}: Props<T>) {
  const Tag: ElementType = as ?? "h2";
  return (
    <Tag
      className={cn("font-outline text-display font-normal", className)}
      {...props}
    />
  );
}

/** Hollow word: transparent fill with a stroke in the given CSS colour. */
export function Stroke({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <em
      className="text-transparent not-italic [-webkit-text-stroke:2px_var(--stroke)]"
      style={{ "--stroke": color } as React.CSSProperties}
    >
      {children}
    </em>
  );
}
