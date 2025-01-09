import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://shashinda.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Shashinda Eshan
            </a>
            . All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/privacy-policy"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="https://webprodigies.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
