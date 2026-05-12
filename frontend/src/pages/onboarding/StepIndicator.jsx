export default function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i < current
              ? 'bg-indigo-500 w-8'
              : i === current
              ? 'bg-indigo-400 w-8 animate-pulse'
              : 'bg-slate-700 w-4'
          }`}
        />
      ))}
    </div>
  )
}
