import { notFound } from "next/navigation";
import { getDocPage, getDocsPages } from "@/lib/docs-config";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

function getPageFromParams(params: DocPageProps["params"]) {
  const slug = params?.slug?.join("/") ?? "overview";
  const page = getDocPage(slug);
  return page;
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const page = getPageFromParams(params)

  if (!page) {
    return {}
  }

  return {
    title: page.title,
    description: page.description,
  }
}

export async function generateStaticParams(): Promise<DocPageProps["params"][]> {
    const pages = getDocsPages();
    return pages.map(page => ({
        slug: page.href === '/docs' ? null : page.href.split('/').slice(2)
    }));
}

export default function DocPage({ params }: DocPageProps) {
  const page = getPageFromParams(params)
  
  if (!page) {
    notFound();
  }

  const allPages = getDocsPages();
  const currentPageIndex = allPages.findIndex(p => p.href.endsWith(page.slug) || (page.slug === 'overview' && p.href === '/docs'));
  const prevPage = currentPageIndex > 0 ? allPages[currentPageIndex - 1] : null;
  const nextPage = currentPageIndex < allPages.length - 1 ? allPages[currentPageIndex + 1] : null;

  return (
    <div className="min-w-0">
        <div className="space-y-2">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">
                {page.title}
            </h1>
            {page.description && (
                <p className="text-lg text-muted-foreground">{page.description}</p>
            )}
        </div>
        <div className="mt-8 space-y-6 [&_h2]:font-headline [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:font-headline [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-4 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">
            {page.content}
        </div>
        <div className="my-12 flex items-center justify-between border-t pt-6">
            {prevPage ? (
            <Link href={prevPage.href} className={cn(buttonVariants({ variant: "outline" }))}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                {prevPage.title}
            </Link>
            ) : <div />}
            {nextPage ? (
            <Link href={nextPage.href} className={cn(buttonVariants({ variant: "outline" }), "ml-auto")}>
                {nextPage.title}
                <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            ) : <div />}
        </div>
    </div>
  );
}
