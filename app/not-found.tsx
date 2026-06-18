import Link from "next/link";
import { Button } from "@/app/components/studio/Button";

export default function NotFound() {
  return (
    <div className="site-gutter py-20 sm:py-28 min-h-[70vh] flex items-center justify-center">
      <div className="studio-section max-w-lg text-center">
        <p className="text-sm font-medium text-studio-accent uppercase tracking-wide mb-3">
          404
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-studio-text">
          Page not found
        </h1>
        <p className="mt-4 text-studio-text-muted leading-relaxed">
          The page you requested does not exist or may have moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button>Return home</Button>
          </Link>
          <Link href="/ls">
            <Button variant="secondary">Liminal Sin</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
