import clsx from 'clsx'

export function Avatar({ label, className }: { label: string; className?: string }) {
  const text = label.slice(0, 2).toUpperCase()
  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 ring-1 ring-white/60',
        className,
      )}
    >
      {text}
    </div>
  )
}

export default Avatar
