"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DatabaseZap, Puzzle, Zap } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Beams from "@/components/Beams";
import { MagicCard } from "@/components/magicui/magic-card";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

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
    <div className="flex min-h-screen flex-col relative">
      {/* Full-page Beams Background */}
      <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>
      
      <div className="relative z-10">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="container py-20 md:py-32 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter text-white">
                High-Density AI Knowledge Storage & Retrieval
              </h1>
              <p className="mt-6 text-lg text-gray-200">
                QRyptography is an open-source framework for building robust, efficient, and scalable knowledge bases for your AI applications.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <InteractiveHoverButton className="rounded-full w-41 flex items-center justify-center">
                  <Link href="/docs" className="flex items-center justify-center w-full h-full text-inherit">
                      Get Started
                  </Link>
                </InteractiveHoverButton>
              </div>
            </div>
          </section>

          {/* Installation Section */}
          <section className="container pb-20 md:pb-32">
            <div className="max-w-xl mx-auto">
              <h2 className="font-headline text-3xl font-bold text-center text-white">
                Start Building in Seconds
              </h2>
              <p className="text-center text-gray-300 mt-2 mb-6">
                Install the package and start integrating your knowledge base right away.
              </p>
              <CodeBlock code="npm install qryptography" />
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-black/40 backdrop-blur-sm py-20 md:py-32">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-headline text-3xl font-bold text-white">Everything You Need for Modern AI Knowledge</h2>
                <p className="mt-4 text-lg text-gray-300">
                  A powerful and flexible framework designed for performance and developer experience.
                </p>
              </div>
               <div className="mt-12 grid gap-8 md:grid-cols-3">
                 {features.map((feature) => (
                   <Card key={feature.title} className="border-none p-0 shadow-none">
                     <MagicCard
                       gradientColor="#262626"
                       gradientSize={300}
                       gradientOpacity={0.6}
                       gradientFrom="#D91480" /* Using primary color */
                       gradientTo="#44238C" /* Using accent color */
                       className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50"
                     >
                       <CardHeader>
                         <div className="mb-4">{feature.icon}</div>
                         <CardTitle className="font-headline text-white">{feature.title}</CardTitle>
                       </CardHeader>
                       <CardContent>
                         <p className="text-gray-300">{feature.description}</p>
                       </CardContent>
                     </MagicCard>
                   </Card>
                 ))}
               </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
