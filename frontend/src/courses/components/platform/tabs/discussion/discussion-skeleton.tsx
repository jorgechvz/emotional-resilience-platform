import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DiscussionForumSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-7 w-48 mb-3 rounded" />
            <Skeleton className="h-4 w-72 rounded" />
          </div>
        </div>
      </div>

      <Card className="border-transparent shadow-sm">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-1/3 mb-2 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-24 w-full rounded" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-28 rounded" />
          </div>
        </CardContent>
      </Card>

      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="border rounded-lg overflow-hidden border-transparent bg-white"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Skeleton className="h-5 w-32 rounded" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-8 w-24 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Card className="border-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3 mb-1 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
