import { useRouterState } from "@tanstack/react-router";

export function HeaderRouteLoader() {
  const isLoading = useRouterState({
    select: (s) => s.isLoading || s.isTransitioning,
  });

  if (!isLoading) {
    return null;
  }
  return (
    <div className="animate-in fade-in absolute inset-x-0 -bottom-1 w-full overflow-hidden">
      <div className="animate-bounce-x from-secondary/0 via-primary to-secondary/0 relative -bottom-px h-1 bg-gradient-to-r" />
    </div>
  );
}
