import Link from "next/link";
import { Github, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Search } from "@/components/search";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/50 backdrop-blur-md">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Search />
          </div>
          <nav className="flex items-center">
             <Link
              href="/docs"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hidden sm:inline-flex text-gray-200 hover:text-warning"
              )}
            >
              <Book className="h-4 w-4 mr-2" />
              Docs
            </Link>
            <Link
              href="https://github.com/gpbacay/qryptorag"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-gray-200 hover:text-warning")}
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
