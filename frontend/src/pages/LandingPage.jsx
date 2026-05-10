import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MOCK_AI_RESPONSE = {
  title: 'Team Meeting — Every Monday 9am',
  breakdown: [
    { step: 1, action: 'Create recurring calendar event every Monday at 9:00 AM' },
    { step: 2, action: 'Send automated invites to all team members' },
    { step: 3, action: 'Set reminder notifications 15 minutes before' },
    { step: 4, action: 'Auto-generate agenda template from previous meeting notes' },
    { step: 5, action: 'Post meeting summary to Slack #team channel after completion' },
  ],
  estimatedTime: '2 minutes to set up',
  confidence: '97%',
}

const features = [
  {
    icon: '🤖',
    title: 'AI Task Generation',
    description: 'Describe tasks in plain English, AI breaks them down into actionable steps automatically.',
  },
  {
    icon: '📅',
    title: 'Smart Scheduling',
    description: 'AI learns your patterns and optimizes your calendar for peak productivity.',
  },
  {
    icon: '📊',
    title: 'Progress Analytics',
    description: 'Real-time insights into your productivity trends with intelligent recommendations.',
  },
]

const stats = [
  { value: '10K+', label: 'Tasks Automated' },
  { value: '98%', label: 'Accuracy Rate' },
  { value: '4.9★', label: 'User Rating' },
]

function LandingPage() {
  const [prompt, setPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const navigate = useNavigate()

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setAiResponse(null)
    setTimeout(() => {
      setAiResponse(MOCK_AI_RESPONSE)
      setIsGenerating(false)
    }, 1400)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg py-12 px-2">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full mb-3">
            <span>✨</span> Powered by Advanced AI
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-3">
            Automate Your Tasks with{' '}
            <span className="gradient-text">AI Intelligence</span>
          </h1>

          <p className="text-base text-slate-300 max-w-xl mx-auto mb-5">
            Stop managing tasks manually. Let AI understand your goals, break them into steps,
            and automate the entire workflow — so you can focus on what truly matters.
          </p>

          {/* Live Demo Input */}
          <div className="bg-slate-800/60 backdrop-blur border border-slate-600/50 rounded-2xl p-6 max-w-2xl mx-auto mb-6 text-left">
            <p className="text-slate-400 text-sm font-medium mb-3">🎯 Try it live — describe a task:</p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your task... e.g. 'Schedule a team meeting every Monday at 9am'"
              rows={3}
              className="w-full bg-slate-900/80 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-slate-500">{prompt.length} characters</span>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors duration-200 flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin">⚙️</span> Generating...
                  </>
                ) : (
                  <>⚡ Generate Task</>
                )}
              </button>
            </div>

            {/* AI Response */}
            {aiResponse && (
              <div className="mt-5 border-t border-slate-700/50 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-400 text-sm font-semibold">✅ AI Task Breakdown Ready</span>
                  <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                    {aiResponse.confidence} confidence
                  </span>
                </div>
                <h4 className="text-white font-semibold mb-3">{aiResponse.title}</h4>
                <ul className="space-y-2">
                  {aiResponse.breakdown.map((item) => (
                    <li key={item.step} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="shrink-0 w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold">
                        {item.step}
                      </span>
                      {item.action}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-500 mt-3">⏱ Estimated setup: {aiResponse.estimatedTime}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-indigo-500/30 text-base"
            >
              Get Started Free →
            </button>
            <button
              onClick={() => navigate('/tasks')}
              className="px-8 py-3.5 bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 text-white font-semibold rounded-xl transition-colors duration-200 text-base"
            >
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900/50 border-y border-slate-700/30 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl sm:text-4xl font-extrabold gradient-text mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm sm:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to{' '}
              <span className="gradient-text">work smarter</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              TaskAI combines cutting-edge AI with intuitive design to supercharge your productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 card-hover"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 border-y border-indigo-500/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to automate your workflow?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Join thousands of professionals who save hours every week with TaskAI.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors duration-200 shadow-xl shadow-indigo-500/30 text-lg"
          >
            Start Automating Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700/30 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xl font-bold gradient-text">⚡ TaskAI</span>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} TaskAI. All rights reserved.
          </p>
          <div className="flex gap-4 text-slate-500 text-sm">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
