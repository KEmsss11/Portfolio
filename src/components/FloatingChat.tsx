"use client"

import { type FormEvent, useEffect, useState } from "react"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

// Turn Markdown bold markers into real <strong> text in the chat UI.
function renderInlineMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }

    return part
  })
}

// Hide RAG citation labels in the displayed answer.
function removeSourceCitations(text: string) {
  return text
    .replace(/\s*\[Source\s+\d+\]/gi, "")
    .replace(/[ \t]+([.,;:!?])/g, "$1")
    .trim()
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [bubbleMessage, setBubbleMessage] = useState("Hi! I'm YUMI")

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")


  useEffect(() => {
    const timer = window.setTimeout(() => setBubbleMessage("Ask me!"), 3000)
    return () => window.clearTimeout(timer)
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const question = input.trim()
    if (!question || isLoading) return

    setInput("")
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, messages }),
      })

      const data: {
        answer?: string
        error?: string
      } = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "The chat request failed.")
      }

      const answer = data.answer
      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("The chat backend returned no answer.")
      }

      setMessages((current) => [
        ...current,
        { role: "user", content: question },
        { role: "assistant", content: removeSourceCitations(answer) },
      ])
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Sorry, I couldn't get an answer. Please try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3"
    >
      <AnimatePresence>
        {isOpen && (
        <motion.section
          key="yumi-chat-panel"
          aria-label="YUMI AI chat"
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mb-3 w-[min(20rem,calc(100vw-3rem))] rounded-2xl border border-card-border bg-background p-5 text-foreground shadow-xl"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-semibold">Hi, I’m Yumi</h2>
              <p className="mt-1 text-sm text-secondary">
                What would you like to explore?
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-2 transition hover:bg-accent"
            >
              <X size={18} />
            </button>
          </div>

          <div
            aria-live="polite"
            className="max-h-64 space-y-3 overflow-y-auto"
          >
            {messages.length === 0 && (
              <p className="text-sm text-secondary">
                Ask me about my projects, skills, or experience.
              </p>
            )}

            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "ml-6 rounded-2xl bg-accent p-3 text-sm leading-6"
                    : "mr-6 whitespace-pre-line rounded-2xl border border-card-border p-3 text-sm leading-6"
                }
              >
                {message.role === "assistant" && message.content.includes("\n- ")
                  ? message.content.split("\n").map((line, lineIndex) => {
                      const isListItem = line.startsWith("- ")
                      return (
                        <span
                          key={lineIndex}
                          className={
                            isListItem
                              ? "block border-t border-card-border py-2 first:border-0"
                              : "block"
                          }
                        >
                          {renderInlineMarkdown(line)}
                        </span>
                      )
                    })
                  : renderInlineMarkdown(message.content)}
              </p>
            ))}

            {isLoading && (
              <p className="text-sm text-secondary">YUMI is thinking…</p>
            )}

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask YUMI a question..."
              aria-label="Your message"
              className="min-w-0 flex-1 rounded-xl border border-card-border bg-background px-3 py-2 text-sm text-foreground"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-xl bg-primary px-4 py-2 text-sm text-background disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </motion.section>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-3">
        <AnimatePresence>
          {!isOpen && (
          <motion.span
            key="ask-bubble"
            initial={{ opacity: 0, x: 8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 rounded-2xl bg-background px-4 py-2 text-sm font-medium text-foreground shadow-lg"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={bubbleMessage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="inline-block"
              >
                {bubbleMessage}
              </motion.span>
            </AnimatePresence>
            <span
              aria-hidden="true"
              className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-background"
            />
          </motion.span>
          )}
        </AnimatePresence>

        <div className="relative">
          {!isOpen && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-zinc-500/60 bg-zinc-400/20 motion-safe:animate-ping"
            />
          )}
          <motion.button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close chat" : "Open chat"}
            aria-expanded={isOpen}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="relative flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-lg shadow-black/15 transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-300"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close-icon"
                  initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                  transition={{ duration: 0.16 }}
                  className="flex"
                >
                  <X size={24} />
                </motion.span>
              ) : (
                <motion.span
                  key="ai-badge"
                  initial={{ opacity: 0, rotate: 20, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -20, scale: 0.7 }}
                  transition={{ duration: 0.16 }}
                  className="relative flex items-center justify-center font-black leading-none tracking-[-0.08em]"
                >
                  <span className="text-[17px] text-zinc-900">A</span>
                  <span className="text-[17px] text-zinc-500">I</span>
                  <span
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 h-2 w-2 rounded-full border border-white bg-zinc-400 shadow-sm"
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
