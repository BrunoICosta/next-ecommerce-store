import { ProductGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-busy="true">
      <span className="sr-only" role="status">
        Carregando…
      </span>
      <Skeleton className="mb-8 h-10 w-64" />
      <ProductGridSkeleton />
    </main>
  );
}
