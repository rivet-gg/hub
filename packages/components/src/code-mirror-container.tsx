import { type PropsWithChildren, forwardRef } from "react";

export const CodeMirrorContainer = forwardRef<
  HTMLDivElement,
  PropsWithChildren
>(({ children }, ref) => {
  return (
    <div ref={ref} className="border rounded-md overflow-hidden">
      {children}
    </div>
  );
});
