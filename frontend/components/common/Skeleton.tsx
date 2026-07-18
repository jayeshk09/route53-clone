export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      <div className="bg-gray-100 px-4 py-3 flex items-center gap-4">
        <div className="h-3 bg-gray-200 rounded w-4" />
        {[200, 80, 100, 80, 120].map((w, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded" style={{ width: w }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3 border-t border-gray-100 flex items-center gap-4">
          <div className="h-3 bg-gray-100 rounded w-4" />
          <div className="h-3 bg-gray-100 rounded w-[200px]" />
          <div className="h-5 bg-gray-100 rounded-full w-[60px]" />
          <div className="h-3 bg-gray-100 rounded w-[80px]" />
          <div className="h-3 bg-gray-100 rounded w-[50px]" />
          <div className="h-3 bg-gray-100 rounded w-[100px]" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="flex items-center gap-2 mb-1">
        <div className="h-5 w-5 bg-gray-200 rounded" />
        <div className="h-7 bg-gray-200 rounded w-12" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-8 bg-gray-200 rounded w-16" />
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
      <div className="space-y-3 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}