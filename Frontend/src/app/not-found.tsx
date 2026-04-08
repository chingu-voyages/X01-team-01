import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container flex flex-col section-padding justify-center items-center">
      <h1 className="text-tagline mb-3 text-sm font-medium tracking-wide uppercase">
        Oops!
      </h1>
      <h2 className="text-foreground text-[80px] leading-none font-semibold sm:text-[120px] md:text-[160px]">
        404
      </h2>
      <p className="text-muted-foreground mt-6 text-lg sm:text-xl">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </section>
  );
}
