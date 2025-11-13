import { QrCode } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label="Go to homepage">
      <QrCode className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold font-headline">QRyptography</span>
    </Link>
  );
}
