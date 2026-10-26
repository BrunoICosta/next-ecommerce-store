import { LoadingStatus } from "@/components/ui/loading-status";
import { ProductGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-busy="true">
      <LoadingStatus />
      <Skeleton className="mb-8 h-10 w-64" />
      <ProductGridSkeleton />
    </main>
  );
}
