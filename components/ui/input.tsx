import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`
        w-full px-4 py-2 rounded border border-zinc-800 bg-zinc-950
        text-white placeholder-zinc-600 transition-colors
        focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
