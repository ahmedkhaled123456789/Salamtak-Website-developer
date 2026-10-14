import { Container } from '../ui/Container';
import { Skeleton } from '../ui/Skeleton';

export function RouteFallback() {
  return (
    <Container className="min-h-[100svh] py-16">
      <div role="status" aria-label="Loading" className="space-y-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-12 w-2/3 max-w-xl" />
        <Skeleton className="h-5 w-1/2 max-w-md" />
        <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) =>
          <Skeleton key={i} className="h-72 rounded-3xl" />
          )}
        </div>
      </div>
    </Container>);

}