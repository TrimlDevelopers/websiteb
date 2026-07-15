import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BotMessageSquare, X, Send, Bot, RotateCcw, ChevronRight } from 'lucide-react'
import { chatbotConfig } from '../../data/chatbot'
import type { ChatSuggestion } from '../../data/chatbot'
import {
  createGreetingMessage,
  createMessageId,
  getBotReply,
  resolveSuggestion,
  type ChatMessage,
} from '../../utils/chatbotEngine'

function ChatLink({
  href,
  label,
  onNavigate,
}: {
  href: string
  label: string
  onNavigate: (href: string) => void
}) {
  const className =
    'inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-brand-100 bg-brand-50/80 px-3 py-2 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-100'

  const isExternal =
    href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')

  if (isExternal) {
    return (
      <a href={href} className={className} onClick={() => onNavigate(href)}>
        {label}
        <ChevronRight size={14} className="opacity-60" />
      </a>
    )
  }

  return (
    <button type="button" onClick={() => onNavigate(href)} className={className}>
      {label}
      <ChevronRight size={14} className="opacity-60" />
    </button>
  )
}

function SuggestionBar({
  suggestions,
  onSelect,
  disabled,
}: {
  suggestions: ChatSuggestion[]
  onSelect: (suggestion: ChatSuggestion) => void
  disabled?: boolean
}) {
  if (suggestions.length === 0) return null

  return (
    <div className="chatbot-suggestions shrink-0 border-t border-slate-200/80 bg-white px-3 py-2.5 sm:px-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        Suggested replies
      </p>
      <div
        className={`flex gap-2 ${
          suggestions.length <= 4
            ? 'flex-wrap'
            : 'chatbot-suggestions-scroll overflow-x-auto pb-0.5'
        }`}
      >
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(suggestion)}
            className="shrink-0 rounded-full border border-brand-200/80 bg-brand-50 px-3.5 py-2 text-xs font-semibold text-brand-600 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  onNavigate,
}: {
  message: ChatMessage
  onNavigate: (href: string) => void
}) {
  const isBot = message.role === 'bot'

  return (
    <div className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 ring-2 ring-white">
          <Bot size={14} strokeWidth={2.25} />
        </div>
      )}

      <div
        className={`max-w-[min(88%,16.5rem)] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed sm:max-w-[78%] sm:text-sm ${
          isBot
            ? 'rounded-tl-md bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/90'
            : 'rounded-tr-md bg-brand-500 text-white shadow-md shadow-brand-500/20'
        }`}
      >
        <p className="whitespace-pre-line break-words">{message.text}</p>
        {message.links && message.links.length > 0 && (
          <div className="mt-2.5 flex flex-col gap-1.5">
            {message.links.map((link) => (
              <ChatLink
                key={link.href + link.label}
                href={link.href}
                label={link.label}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([createGreetingMessage()])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<number | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const activeSuggestions = useMemo(() => {
    if (typing) return []

    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const message = messages[index]
      if (message.role === 'bot' && message.suggestions && message.suggestions.length > 0) {
        return message.suggestions
      }
    }

    return []
  }, [messages, typing])

  const closeChat = useCallback(() => setOpen(false), [])

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
  }, [])

  const handleNavigate = useCallback(
    (href: string) => {
      closeChat()

      if (href.startsWith('mailto:') || href.startsWith('tel:')) {
        window.location.href = href
        return
      }

      if (href.startsWith('http')) {
        window.open(href, '_blank', 'noopener,noreferrer')
        return
      }

      const [pathPart, hashPart] = href.split('#')
      const path = pathPart || '/'
      const hash = hashPart ? `#${hashPart}` : ''

      if (hash) {
        if (location.pathname === path) {
          window.history.pushState(null, '', `${path}${hash}`)
          document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
        } else {
          navigate(`${path}${hash}`)
        }
        return
      }

      navigate(path)
    },
    [closeChat, location.pathname, navigate],
  )

  useEffect(() => {
    if (!open) return
    const frame = window.requestAnimationFrame(scrollToBottom)
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(focusTimer)
    }
  }, [open, messages, typing, activeSuggestions, scrollToBottom])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeChat()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, closeChat])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  function addBotReply(reply: ChatMessage) {
    setTyping(true)
    typingTimeoutRef.current = window.setTimeout(() => {
      setMessages((prev) => [...prev, reply])
      setTyping(false)
      typingTimeoutRef.current = null
    }, 450)
  }

  function sendUserMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || typing) return

    setMessages((prev) => [
      ...prev,
      { id: createMessageId('user'), role: 'user', text: trimmed },
    ])
    setInput('')
    addBotReply(getBotReply(trimmed))
  }

  function handleSuggestion(suggestion: ChatSuggestion) {
    if (typing) return

    const result = resolveSuggestion(suggestion)

    setMessages((prev) => [
      ...prev,
      { id: createMessageId('user'), role: 'user', text: result.userLabel },
    ])

    if (result.navigate) {
      addBotReply(result.reply)
      window.setTimeout(() => handleNavigate(result.navigate!), 350)
      return
    }

    addBotReply(result.reply)
  }

  function handleReset() {
    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
    setTyping(false)
    setInput('')
    setMessages([createGreetingMessage()])
    window.setTimeout(() => {
      scrollToBottom()
      inputRef.current?.focus()
    }, 50)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    sendUserMessage(input)
  }

  const panelHeight =
    'min(580px, calc(100dvh - 4.5rem - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px)))'

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-[60] bg-slate-900/35 backdrop-blur-[1px] sm:bg-slate-900/25"
          onClick={closeChat}
          aria-label="Close chat overlay"
        />
      )}

      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] z-[70] flex flex-col items-end gap-3">
        {open && (
          <div
            className="chatbot-panel flex w-[min(calc(100vw-1.25rem),380px)] flex-col overflow-hidden rounded-[1.25rem] border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/20"
            style={{ height: panelHeight }}
            role="dialog"
            aria-modal="true"
            aria-label="Chat assistant"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3.5 text-white">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <Bot size={20} />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-brand-500 bg-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-tight">{chatbotConfig.name}</p>
                  <p className="text-xs text-blue-100/90">Typically replies instantly</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/15"
                  aria-label="Restart conversation"
                  title="Restart conversation"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/15"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="chatbot-messages flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain bg-gradient-to-b from-slate-100/80 to-slate-50 px-3 py-4 sm:gap-3.5 sm:px-4"
            >
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} onNavigate={handleNavigate} />
              ))}

              {typing && (
                <div className="flex gap-2">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 ring-2 ring-white">
                    <Bot size={14} strokeWidth={2.25} />
                  </div>
                  <div className="rounded-2xl rounded-tl-md bg-white px-3.5 py-3 shadow-sm ring-1 ring-slate-200/90">
                    <span className="inline-flex gap-1" aria-label="Assistant is typing">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-px shrink-0" />
            </div>

            <SuggestionBar
              suggestions={activeSuggestions}
              onSelect={handleSuggestion}
              disabled={typing}
            />

            <div className="shrink-0 border-t border-slate-200/80 bg-white">
              <form onSubmit={handleSubmit} className="px-3 pb-3 pt-2.5 sm:px-4">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-brand-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/10">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={chatbotConfig.placeholder}
                    disabled={typing}
                    className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
                    autoComplete="off"
                    aria-label="Chat message"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || typing}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send size={15} />
                  </button>
                </div>
                <p className="mt-2 px-1 text-center text-[10px] leading-relaxed text-slate-400">
                  {chatbotConfig.offlineNote}
                </p>
              </form>
            </div>
          </div>
        )}

        <div className={open ? 'relative' : 'chatbot-launcher relative'}>
          {!open && (
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-1 rounded-full bg-brand-400/25 animate-ping"
            />
          )}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/35 active:scale-95 ${
              open ? '' : 'btn-pulse'
            }`}
            aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <BotMessageSquare size={26} strokeWidth={2} />}
          </button>
        </div>
      </div>
    </>
  )
}
