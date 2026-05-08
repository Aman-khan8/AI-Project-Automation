import { useState, useRef, useEffect } from 'react'

// ─── Mock AI parser ───────────────────────────────────────────────────────────
const COMMANDS = [
  {
    match: /add task[:\s]+(.+?)(?:\s+by\s+(.+))?$/i,
    handler: (m) => ({
      type: 'task_added',
      task: { name: m[1].trim(), due: m[2] ? m[2].trim() : null, priority: 'Medium', status: 'pending' },
      reply: `✅ Task added: **${m[1].trim()}**${m[2] ? ` — due **${m[2].trim()}**` : ''}`,
    }),
  },
  {
    match: /show (tasks|my tasks|all tasks)/i,
    handler: () => ({
      type: 'show_tasks',
      reply: '📋 Here are your current tasks:',
      tasks: [
        { name: 'Prepare Q4 financial report', priority: 'High', status: 'in-progress', due: '2026-05-15' },
        { name: 'Review pull requests', priority: 'High', status: 'pending', due: '2026-05-12' },
        { name: 'Update team documentation', priority: 'Medium', status: 'pending', due: '2026-05-20' },
        { name: 'Optimize database queries', priority: 'Low', status: 'in-progress', due: '2026-05-28' },
      ],
    }),
  },
  {
    match: /schedule|calendar|upcoming/i,
    handler: () => ({
      type: 'schedule',
      reply: '📅 You have **5 events** this week. Your busiest day is **Wednesday** with 3 overlapping tasks. I\'ve flagged 2 scheduling conflicts for your review.',
    }),
  },
  {
    match: /summar(y|ize)|how am i doing|progress/i,
    handler: () => ({
      type: 'summary',
      reply: '📊 **Weekly Summary:** You\'ve completed **8 tasks** this week (↑23% vs last week). Your productivity score is **92/100**. Top focus area: Engineering. 3 tasks are overdue — want me to reschedule them?',
    }),
  },
  {
    match: /priorit(y|ize)|what should i (do|work on)/i,
    handler: () => ({
      type: 'priority',
      reply: '🎯 Based on deadlines and impact, I recommend:\n1. **Q4 financial report** — due in 2 days, high impact\n2. **Auth module PR review** — blocking 2 teammates\n3. **Team documentation** — low effort, quick win\n\nShall I block focus time for these?',
    }),
  },
  {
    match: /hello|hi|hey|good morning|good afternoon/i,
    handler: () => ({
      type: 'greeting',
      reply: '👋 Hey Alex! I\'m your AI task assistant. You can tell me things like:\n- *"Add task: finish report by Friday"*\n- *"Show my tasks"*\n- *"What should I work on?"*\n- *"Summarize my week"*',
    }),
  },
  {
    match: /help|what can you do/i,
    handler: () => ({
      type: 'help',
      reply: '🤖 Here\'s what I can do:\n\n**Tasks** — *"Add task: [name] by [date]"*\n**View** — *"Show my tasks"*\n**Schedule** — *"Show my calendar"*\n**Priority** — *"What should I work on?"*\n**Summary** — *"Summarize my week"*',
    }),
  },
]

function parseCommand(input) {
  for (const cmd of COMMANDS) {
    const m = input.match(cmd.match)
    if (m) return cmd.handler(m)
  }
  return {
    type: 'unknown',
    reply: `🤔 I'm not sure how to handle that yet. Try saying *"Add task: finish report by Friday"* or *"Show my tasks"*. Type **help** to see all commands.`,
  }
}

// ─── Priority / Status colours ────────────────────────────────────────────────
const PRIORITY_COLOR = {
  High: 'bg-red-500/20 text-red-400 border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
}
const STATUS_COLOR = {
  pending: 'bg-slate-500/20 text-slate-400',
  'in-progress': 'bg-blue-500/20 text-blue-400',
  completed: 'bg-green-500/20 text-green-400',
}

// ─── Skeleton loader for "AI is typing" ──────────────────────────────────────
function TypingBubble() {
  return (
    <div className="flex items-end gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-sm shrink-0">
        🤖
      </div>
      <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}

// ─── Skeleton for task list inside chat ──────────────────────────────────────
function TaskListSkeleton() {
  return (
    <div className="mt-3 space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 bg-slate-700/40 rounded-xl animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  )
}

// ─── Render markdown-lite (bold + newlines) ───────────────────────────────────
function MdText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
        if (part.startsWith('*') && part.endsWith('*'))
          return <em key={i} className="text-slate-300 italic">{part.slice(1, -1)}</em>
        return part.split('\n').map((line, j, arr) => (
          <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
        ))
      })}
    </span>
  )
}

// ─── Single message bubble ────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  const [tasksLoaded, setTasksLoaded] = useState(false)

  useEffect(() => {
    if (msg.data?.tasks) {
      const t = setTimeout(() => setTasksLoaded(true), 600)
      return () => clearTimeout(t)
    }
  }, [msg.data])

  return (
    <div className={`flex items-end gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
        isUser
          ? 'bg-indigo-600 text-white font-bold'
          : 'bg-indigo-600/30 border border-indigo-500/40'
      }`}>
        {isUser ? 'A' : '🤖'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] sm:max-w-[65%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-bl-sm'
        }`}>
          <MdText text={msg.text} />

          {/* Optimistic badge for newly added tasks */}
          {msg.data?.type === 'task_added' && (
            <div className="mt-3 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
              <span className="text-green-400 text-xs font-semibold">✅ Saved to Task Manager</span>
              {msg.optimistic && (
                <span className="text-xs text-slate-500 ml-auto animate-pulse">syncing…</span>
              )}
            </div>
          )}

          {/* Task list with skeleton */}
          {msg.data?.tasks && (
            <div className="mt-3">
              {!tasksLoaded ? (
                <TaskListSkeleton />
              ) : (
                <div className="space-y-2">
                  {msg.data.tasks.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-slate-900/60 border border-slate-700/40 rounded-xl px-3 py-2 gap-2 animate-fade-in"
                    >
                      <span className="text-white text-xs font-medium truncate">{t.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_COLOR[t.priority]}`}>
                          {t.priority}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[t.status]}`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-slate-600 px-1">{msg.time}</span>
      </div>
    </div>
  )
}

// ─── Animated empty state ─────────────────────────────────────────────────────
function EmptyState() {
  const suggestions = [
    { icon: '➕', text: 'Add task: finish report by Friday' },
    { icon: '📋', text: 'Show my tasks' },
    { icon: '🎯', text: 'What should I work on?' },
    { icon: '📊', text: 'Summarize my week' },
  ]
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-4xl animate-float">
          🤖
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">AI Assistant Ready</h3>
      <p className="text-slate-400 text-sm max-w-xs mb-8">
        Type a command in natural language — I'll handle the rest.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
        {suggestions.map((s, i) => (
          <button
            key={i}
            className="flex items-center gap-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-indigo-500/40 rounded-xl px-4 py-3 text-left text-sm text-slate-300 hover:text-white transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
            onClick={() => {
              // bubble up via custom event so parent can fill input
              window.dispatchEvent(new CustomEvent('chat-suggestion', { detail: s.text }))
            }}
          >
            <span className="text-base">{s.icon}</span>
            <span className="italic text-slate-400 text-xs">"{s.text}"</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
function AiChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const now = () =>
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  // Listen for suggestion chip clicks
  useEffect(() => {
    const handler = (e) => {
      setInput(e.detail)
      inputRef.current?.focus()
    }
    window.addEventListener('chat-suggestion', handler)
    return () => window.removeEventListener('chat-suggestion', handler)
  }, [])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return

    const userMsg = { id: Date.now(), role: 'user', text, time: now() }

    // Optimistic UI — user message appears instantly
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const result = parseCommand(text)

    // Simulate AI latency (skeleton/typing indicator shown during this time)
    const delay = result.type === 'show_tasks' ? 1200 : 800
    setTimeout(() => {
      setIsTyping(false)
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: result.reply,
        time: now(),
        data: result,
        optimistic: result.type === 'task_added',
      }
      setMessages((prev) => [...prev, aiMsg])

      // Mark optimistic as confirmed after short delay
      if (result.type === 'task_added') {
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) => (m.id === aiMsg.id ? { ...m, optimistic: false } : m))
          )
        }, 1500)
      }
    }, delay)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => setMessages([])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="max-w-3xl w-full mx-auto flex flex-col flex-1 px-4 py-6" style={{ height: 'calc(100vh - 64px)' }}>

        {/* Page header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Chat</h1>
            <p className="text-slate-400 text-sm mt-0.5">Natural language task commands</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              AI Online
            </span>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-slate-500 hover:text-slate-300 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-full transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 overflow-y-auto rounded-2xl bg-slate-900/40 border border-slate-700/50 p-4 space-y-4 min-h-0 scrollbar-thin">
          {messages.length === 0 && !isTyping ? (
            <EmptyState />
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              {isTyping && <TypingBubble />}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="mt-4 shrink-0">
          <div className="flex items-end gap-3 bg-slate-800/60 border border-slate-700/50 focus-within:border-indigo-500/50 rounded-2xl px-4 py-3 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder='Try: "Add task: finish report by Friday"'
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm resize-none focus:outline-none leading-relaxed max-h-32 overflow-y-auto"
              style={{ fieldSizing: 'content' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="shrink-0 w-9 h-9 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-2 text-center">
            Press <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400">Enter</kbd> to send · <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400">Shift+Enter</kbd> for new line
          </p>
        </div>

      </div>
    </div>
  )
}

export default AiChat
