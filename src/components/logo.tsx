import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label="Go to homepage">
      <Image
        src="/images/qrve_logo.png"
        alt="QRyptoRAG Logo"
        width={24}
        height={24}
        className="h-6 w-6"
      />
      <span className="text-lg font-semibold font-headline text-white">QRyptoRAG</span>
    </Link>
  );
}
