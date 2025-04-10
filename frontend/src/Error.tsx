import { ArrowLeft } from "lucide-react";
import { Button } from "./components/ui/button";

export function Error({
  code = 404,
  message = "Not found",
}: {
  code?: number;
  message?: string;
}) {
  return (
    <article className="flex flex-col gap-6">
      <div className="flex h-full min-h-full w-full flex-grow items-center justify-center gap-6">
        <h1 className="text-5xl lg:text-7xl">{code}</h1>
        <div className="h-24 w-[1px] bg-white lg:h-36"></div>
        <p className="text-2xl lg:text-4xl">{message}</p>
      </div>
      <a
        href="/"
        className="inline-flex items-center gap-2 self-center text-xl md:text-2xl"
      >
        <ArrowLeft />
        Back Home
      </a>
    </article>
  );
}
