import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, DatabaseZap, Puzzle, Zap } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  const features = [
    {
      icon: <DatabaseZap className="w-8 h-8 text-primary" />,
      title: "High-Density Storage",
      description: "Store extensive knowledge bases in a fraction of the space using advanced encoding.",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Fast Retrieval",
      description: "Optimized for low-latency querying, perfect for real-time AI applications.",
    },
    {
      icon: <Puzzle className="w-8 h-8 text-primary" />,
      title: "Extensible Adapters",
      description: "Easily connect to various data sources and vector databases.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-20 md:py-32 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter">
              High-Density AI Knowledge Storage & Retrieval
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              QRyptography is an open-source framework for building robust, efficient, and scalable knowledge bases for your AI applications.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/docs">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Installation Section */}
        <section className="container pb-20 md:pb-32">
          <div className="max-w-xl mx-auto">
            <h2 className="font-headline text-3xl font-bold text-center">
              Start Building in Seconds
            </h2>
            <p className="text-center text-muted-foreground mt-2 mb-6">
              Install the package and start integrating your knowledge base right away.
            </p>
            <CodeBlock code="npm install qryptography" />
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-secondary py-20 md:py-32">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-headline text-3xl font-bold">Everything You Need for Modern AI Knowledge</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A powerful and flexible framework designed for performance and developer experience.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-background/80">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
