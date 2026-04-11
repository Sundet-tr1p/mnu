import clsx from 'clsx'

export function Avatar({ label, className }: { label: string; className?: string }) {
  const text = label.slice(0, 2).toUpperCase()
  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white',
        className,
      )}
    >
      {text}
    </div>
  )
}

export default Avatar
