import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Class utility — combines clsx (conditionals) with tailwind-merge (resolves conflicts).
 *
 * Why: without twMerge, writing `cn('p-2', cond && 'p-4')` produces `"p-2 p-4"`
 * and Tailwind applies whatever comes last in the CSS, not the intended class.
 * twMerge resolves this by inspecting the design system tokens.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
