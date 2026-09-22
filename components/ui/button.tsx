import React from 'react';

/**
 * ⚠ THIS COMPONENT ACCEPTED `variant` AND `size` NOWHERE AND DROPPED THEM SILENTLY.
 *
 * The previous body was `({ children, className = '', ...props })` spread onto a bare
 * `<button>`. Three call sites pass `variant="outline"` and `size="sm"`; React does not
 * recognise either as a DOM attribute, so both were discarded and those buttons rendered
 * with no styling beyond whatever `className` happened to carry. TypeScript was reporting it
 * — "Property 'variant' does not exist" — and the errors were being carried as noise rather
 * than read as "this button does not look the way the code says it does".
 *
 * Kept deliberately small: this is a local stub, not shadcn/ui, and the variants implemented
 * are exactly the ones the codebase actually asks for. Inventing a full variant system here
 * would be guessing at a design nobody has specified.
 */

export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
    default: 'bg-zinc-900 text-white hover:bg-zinc-800 border border-transparent',
    outline: 'bg-transparent text-zinc-900 border border-zinc-300 hover:bg-zinc-50',
    ghost: 'bg-transparent text-zinc-700 border border-transparent hover:bg-zinc-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700 border border-transparent',
};

const SIZES: Record<ButtonSize, string> = {
    sm: 'px-2.5 py-1 text-sm',
    md: 'px-3.5 py-1.5 text-sm',
    lg: 'px-5 py-2.5 text-base',
};

const BASE = 'inline-flex items-center justify-center gap-2 rounded-md font-medium '
    + 'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 '
    + 'disabled:pointer-events-none disabled:opacity-50';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
}

export function Button({
    children,
    className = '',
    variant = 'default',
    size = 'md',
    ...props
}: ButtonProps) {
    /*
     * `className` comes LAST so a caller's own utilities still win — several call sites pass
     * layout classes like `w-full` and `mt-4` alongside a variant, and those must not be
     * overridden by the defaults above.
     */
    return (
        <button className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...props}>
            {children}
        </button>
    );
}

export default Button;
