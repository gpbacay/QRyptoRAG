import React from "react";
import { CodeBlock } from "@/components/code-block"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type DocsConfig = {
  mainNav: NavItem[]
  sidebarNav: {
    title: string
    items: NavItem[]
  }[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "GitHub",
      href: "https://github.com/firebase/genkit",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Overview",
          href: "/docs",
        },
        {
          title: "Installation",
          href: "/docs/installation",
        },
      ],
    },
    {
      title: "Core Concepts",
      items: [
        {
          title: "Architecture",
          href: "/docs/architecture",
        },
        {
          title: "Adapters",
          href: "/docs/adapters",
        },
        {
          title: "Encoding & Retrieval",
          href: "/docs/encoding-retrieval",
        },
      ],
    },
    {
      title: "API Reference",
      items: [
        {
          title: "API Reference",
          href: "/docs/api-reference",
        },
      ],
    },
    {
      title: "Guides",
      items: [
        {
          title: "Examples",
          href: "/docs/examples",
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Changelog",
          href: "/docs/changelog",
        },
        {
          title: "FAQ",
          href: "/docs/faq",
        },
      ],
    },
  ],
}

export type DocPage = {
  slug: string
  title: string
  description?: string
  content: React.ReactNode
}

const docsContent: DocPage[] = [
  {
    slug: "overview",
    title: "Overview",
    description: "QRyptography is an open-source NPM package framework for high-density AI knowledge storage and retrieval. It leverages advanced encoding techniques to store vast amounts of information in a compact, queryable format.",
    content: (
      <>
        <h2>Why QRyptography?</h2>
        <p>In the age of large language models, managing and accessing knowledge efficiently is paramount. QRyptography provides a robust solution for:</p>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li><strong>High-Density Storage:</strong> Store extensive knowledge bases in a fraction of the space.</li>
          <li><strong>Fast Retrieval:</strong> Optimized for low-latency querying, perfect for real-time AI applications.</li>
          <li><strong>Extensible Adapters:</strong> Easily connect to various data sources and vector databases.</li>
          <li><strong>TypeScript Native:</strong> Built with TypeScript for a seamless developer experience in modern web ecosystems.</li>
        </ul>
        <h2>Key Features</h2>
        <p>Explore the core features that make QRyptography a powerful choice for your next AI project.</p>
      </>
    ),
  },
  {
    slug: "installation",
    title: "Installation",
    description: "Get started with QRyptography by installing it from your favorite package manager.",
    content: (
      <>
        <p>You can add QRyptography to your project using npm, yarn, or pnpm. This will give you access to all the core functionalities of the framework.</p>
        <h3 className="mt-4 font-semibold">NPM</h3>
        <CodeBlock code="npm install qryptography" />
        <h3 className="mt-4 font-semibold">Yarn</h3>
        <CodeBlock code="yarn add qryptography" />
        <h3 className="mt-4 font-semibold">PNPM</h3>
        <CodeBlock code="pnpm add qryptography" />
      </>
    ),
  },
  {
    slug: "architecture",
    title: "Architecture",
    description: "Understand the high-level architecture of QRyptography and how its components work together.",
    content: <p>This page is a placeholder. Content for Architecture will be added soon.</p>,
  },
  {
    slug: "adapters",
    title: "Adapters",
    description: "Learn how to use and create adapters to connect QRyptography to different data sources.",
    content: <p>This page is a placeholder. Content for Adapters will be added soon.</p>,
  },
  {
    slug: "encoding-retrieval",
    title: "Encoding & Retrieval",
    description: "A deep dive into the encoding and retrieval mechanisms at the heart of QRyptography.",
    content: <p>This page is a placeholder. Content for Encoding & Retrieval will be added soon.</p>,
  },
  {
    slug: "api-reference",
    title: "API Reference",
    description: "Detailed API reference for all public methods and classes in QRyptography.",
    content: <p>This page is a placeholder. Content for API Reference will be added soon.</p>,
  },
  {
    slug: "examples",
    title: "Examples",
    description: "See QRyptography in action with practical examples and use cases.",
    content: <p>This page is a placeholder. Content for Examples will be added soon.</p>,
  },
  {
    slug: "changelog",
    title: "Changelog",
    description: "A log of all changes, new features, and bug fixes for each version of QRyptography.",
    content: <p>This page is a placeholder. Content for Changelog will be added soon.</p>,
  },
  {
    slug: "faq",
    title: "FAQ",
    description: "Frequently asked questions about QRyptography.",
    content: <p>This page is a placeholder. Content for FAQ will be added soon.</p>,
  },
]

export function getDocsPages() {
  return docsConfig.sidebarNav.flatMap(group => group.items)
}

export function getDocPage(slug: string) {
  const effectiveSlug = (slug === "") ? "overview" : slug
  return docsContent.find(page => page.slug === effectiveSlug)
}
