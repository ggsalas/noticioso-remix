import type { LegacyRef } from "react";
import { useState, useCallback } from "react";

interface MeasureReturn<T> {
  ref: LegacyRef<T>;
  width?: number;
  height?: number;
}

export function useMeasure<T>(kind: ("width" | "height")[]): MeasureReturn<T> {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  const ref = useCallback(
    (node: any) => {
      if (node !== null) {
        const resizeObserver = new ResizeObserver((entries) => {
          const entry = entries[0];

          const width = entry.target.getBoundingClientRect().width;
          const height = entry.target.getBoundingClientRect().height;

          if (kind.includes("width") && width) setWidth(width);
          if (kind.includes("height") && height) setHeight(height);
        });

        resizeObserver.observe(node);

        return () => {
          resizeObserver.unobserve(node);
        };
      }
    },
    [kind]
  );

  return { ref, width, height };
}
