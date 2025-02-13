import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  size?: "sm" | "md" | "lg"
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, size = "md", icon, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center", className)}>
        {icon && (
          <span className="absolute left-3 text-gray-500">{icon}</span>
        )}
        <input
          type={type}
          className={cn(
            "w-full rounded-md border bg-transparent px-3 py-1.5 text-base shadow-sm transition-colors placeholder-gray-400 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
            {
              "border-black focus:ring-primary": !error,
              "border-red-500 focus:ring-red-500": error, // Realça erro
              "h-8 text-sm": size === "sm",
              "h-10 text-base": size === "md",
              "h-12 text-lg": size === "lg",
              "pl-10": icon, // Adiciona padding se houver ícone
            }
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
