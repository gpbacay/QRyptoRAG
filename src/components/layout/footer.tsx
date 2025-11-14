import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Github, Book, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black/60 backdrop-blur-md text-gray-200 border-t border-gray-800">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-gray-300">
              High-density knowledge storage for RAG systems using QR-encoded video.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 col-span-3 gap-8 text-sm">
            <div>
              <h3 className="font-semibold mb-4 text-white">Docs</h3>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-300 hover:text-primary transition-colors">Overview</Link></li>
                <li><Link href="/docs/installation" className="text-gray-300 hover:text-primary transition-colors">Installation</Link></li>
                <li><Link href="/docs/architecture" className="text-gray-300 hover:text-primary transition-colors">Architecture</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Community</h3>
              <ul className="space-y-2">
                <li><a href="https://github.com/gpbacay/qryptorag" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"><Github className="w-4 h-4"/> GitHub</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors">Twitter</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">More</h3>
              <ul className="space-y-2">
                <li><Link href="/docs/changelog" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"><Book className="w-4 h-4"/> Changelog</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"><Shield className="w-4 h-4"/> License</Link></li>
                <li>
                  <a href="https://www.npmjs.com/package/qr-video-rag" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2">
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor"><title>npm</title><path d="M0 0h24v24H0V0zm22.5 2.25h-21V21.75h21V2.25zM9 8.25H6.75v7.5H4.5v-7.5H2.25V6h6.75v2.25zm4.5 0H11.25v7.5h-3V6H12v2.25h1.5V6H15v8.25h-1.5V8.25zm6.75 5.25h-3v1.5h-1.5v-6h1.5v4.5h3v-4.5h1.5v6h-1.5v-1.5z"/></svg>
                    NPM
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-gray-800" />
        <div className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} QRyptoRAG. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
