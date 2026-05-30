export default function MovieSkeleton() {
  return (
    <div className="w-screen animate-pulse">
      <div className="h-screen sm:h-96 md:h-150 bg-white/5" />

      <div className="mx-auto px-4 sm:px-8 lg:px-20 md:-mt-120 -mt-70 relative z-10 pb-20">

        <div className="flex h-screen flex-col gap-8 items-center">

          <div className="w-40 sm:w-45 md:w-50 h-60 md:h-75 bg-white/10 rounded-xl" />

          <div className="flex gap-2 w-50">
            <div className="h-12 flex-1 bg-white/10 rounded-full" />
            <div className="h-12 w-12 bg-white/10 rounded-full" />
            <div className="h-12 w-12 bg-white/10 rounded-full" />
          </div>

          <div className="h-12 w-80 bg-white/10 rounded-lg" />

          <div className="h-4 w-60 bg-white/10 rounded" />

          <div className="flex gap-2 flex-wrap justify-center">
            {[1,2,3,4].map(i => (
              <div
                key={i}
                className="h-8 w-24 bg-white/10 rounded-full"
              />
            ))}
          </div>

          <div className="w-full max-w-4xl flex flex-col gap-2">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-3/4" />
          </div>
        </div>

        <section className="mt-16">
          <div className="h-8 w-40 bg-white/10 rounded mb-6" />

          <div className="flex gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-32 shrink-0">
                <div className="h-40 bg-white/10 rounded-lg mb-2" />
                <div className="h-4 bg-white/10 rounded mb-2" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="h-8 w-52 bg-white/10 rounded mb-6" />

          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-xl p-4"
              >
                <div className="flex gap-3 mb-4">
                  <div className="size-10 rounded-full bg-white/10" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-24 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-32" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded" />
                  <div className="h-3 bg-white/10 rounded" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="h-8 w-40 bg-white/10 rounded mb-6" />

          <div className="flex gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-50 w-34 bg-white/10 rounded-lg shrink-0"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}