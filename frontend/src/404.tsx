export function NotFound() {
  return (
    <article className="flex h-full min-h-full flex-grow items-center justify-center gap-6">
      <h1 className="text-5xl lg:text-7xl">404</h1>
      <div className="h-24 w-[1px] bg-white lg:h-36"></div>
      <p className="text-2xl lg:text-4xl">Not found</p>
    </article>
  );
}
