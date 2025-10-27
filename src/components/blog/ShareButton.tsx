"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"

interface ShareButtonProps {
  title?: string
  text?: string
  className?: string
}

export default function ShareButton({ title, text, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    try {
      setSharing(true)
      if (navigator.share) {
        await navigator.share({ title, text, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (_err) {
      // Fallback to copy if share fails
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {}
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share Article"
        disabled={sharing}
        className={
          className ||
          "inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg transition-colors"
        }
      >
        <Share2 className="w-4 h-4" />
        <span>{copied ? "Link copied!" : "Share Article"}</span>
      </button>
    </div>
  )
}