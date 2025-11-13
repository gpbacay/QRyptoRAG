"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CodeBlock({ code }: { code: string }) {
  const [hasCopied, setHasCopied] = React.useState(false)
  const { toast } = useToast()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setHasCopied(true)
    toast({
      description: "Copied to clipboard!",
    })
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <div className="relative font-code bg-muted rounded-md my-4 border">
      <div className="absolute top-2 right-2">
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-md bg-background/70 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {hasCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}
