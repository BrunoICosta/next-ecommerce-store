import { LoadingStatus } from "@/components/ui/loading-status";
import { ProductGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-busy="true">
      <LoadingStatus />
      <Skeleton className="h-10 w-48" />
      <Skeleton className="mt-3 mb-8 h-5 w-96 max-w-full" />
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden space-y-4 lg:block">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
        <ProductGridSkeleton count={9} />
      </div>
    </main>
  );
}
