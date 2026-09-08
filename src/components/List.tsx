import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ListProps<T> {
  items: T[] | undefined;
  loading: boolean;
  error: string | undefined;
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  emptyMessage: string;
  skeletonCount?: number;
}

export function List<T>({
  items,
  loading,
  error,
  getKey,
  renderItem,
  emptyMessage,
  skeletonCount = 3,
}: ListProps<T>) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: skeletonCount }).map((_, n) => (
          <Skeleton key={n} className="h-24 w-full rounded-none" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="rounded-none border-rust/30 bg-rust/5">
        <AlertDescription className="text-rust">
          Något gick fel: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!items || items.length === 0) {
    return <p className="text-ink-muted">{emptyMessage}</p>;
  }

  return (
    <ul className="flex flex-col gap-3 *:list-none">
      {items.map((item, index) => (
        <li key={getKey(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

export default List;
