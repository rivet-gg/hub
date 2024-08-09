import { Skeleton, cn } from "@rivet-gg/components";
import type { ReactNode } from "react";

interface PageRootProps {
  children: ReactNode;
  layout?: "compact" | "full";
}

const PageRoot = ({ children, layout = "compact" }: PageRootProps) => (
  <div
    className={cn(
      {
        container: layout === "compact",
        "px-8 w-full flex-1 h-full flex min-h-0": layout === "full",
      },
      "pt-4",
    )}
  >
    {children}
  </div>
);

const PageRootSkeleton = ({
  layout = "compact",
}: Pick<PageRootProps, "layout">) => {
  return (
    <div
      className={cn(
        {
          container: layout === "compact",
          "px-8 w-full h-full": layout === "full",
        },
        "pt-4",
      )}
    >
      <Skeleton className="my-8 h-12 w-1/3" />
      <div className="mb-4 flex flex-row gap-4">
        <Skeleton className="h-64 w-2/3" />
        <Skeleton className="h-64 w-1/3" />
      </div>
      <Skeleton className="mb-4 h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
};

PageRoot.Skeleton = PageRootSkeleton;

export { PageRoot as Root };
