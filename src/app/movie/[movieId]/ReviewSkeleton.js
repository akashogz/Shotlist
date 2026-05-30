export function ReviewSkeleton() {
    return (
        <>
            <h3 className="text-3xl font-bold animate-none mb-5 mt-5">Community Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-pulse">

                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="flex flex-col gap-3 bg-[#303030] rounded-lg p-3"
                    >
                        <div className="flex gap-2 items-center">
                            <div className="size-9 rounded-full bg-white/10" />
                            <div className="flex flex-col gap-1">
                                <div className="h-3 w-24 bg-white/10 rounded" />
                                <div className="h-2 w-32 bg-white/10 rounded" />
                            </div>
                        </div>

                        <div className="h-3 w-28 bg-white/10 rounded" />

                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((j) => (
                                <div
                                    key={j}
                                    className="size-4 rounded bg-white/10"
                                />
                            ))}
                        </div>

                        <div className="space-y-2">
                            <div className="h-3 bg-white/10 rounded w-full" />
                            <div className="h-3 bg-white/10 rounded w-full" />
                            <div className="h-3 bg-white/10 rounded w-2/3" />
                        </div>

                        <div className="flex justify-end">
                            <div className="h-3 w-16 bg-white/10 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </>

    );
}