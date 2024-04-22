import {
  Virtualizer,
  VirtualizerOptions,
  useVirtualizer,
} from "@tanstack/react-virtual";
import { ScrollArea, ScrollAreaProps } from "./ui/scroll-area";
import {
  ReactElement,
  RefObject,
  cloneElement,
  useImperativeHandle,
  useRef,
} from "react";

interface VirtualScrollAreaProps<TItem extends Record<string, any>>
  // optional
  extends Partial<
      Omit<
        VirtualizerOptions<HTMLDivElement, Element>,
        "getScrollElement" | "estimateSize" | "count"
      >
    >,
    // required
    Pick<VirtualizerOptions<HTMLDivElement, Element>, "estimateSize" | "count">,
    Pick<ScrollAreaProps, "viewportProps"> {
  getRowData: (index: number) => TItem;
  className?: string;
  row: ReactElement<TItem>;
  virtualizerRef?: RefObject<Virtualizer<HTMLDivElement, Element>>;
}

export function VirtualScrollArea<TItem extends Record<string, any>>({
  className,
  row: Row,
  getRowData,
  viewportProps,
  virtualizerRef,
  ...rowVirtualizerOptions
}: VirtualScrollAreaProps<TItem>) {
  const ref = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    ...rowVirtualizerOptions,
    getScrollElement: () => ref.current,
  });

  useImperativeHandle(virtualizerRef, () => rowVirtualizer, [rowVirtualizer]);

  return (
    <ScrollArea
      viewportRef={ref}
      className={className}
      viewportProps={viewportProps}
    >
      <div
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            className="absolute w-full inset-x-0"
            style={{
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {cloneElement(Row, getRowData(virtualItem.index))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
