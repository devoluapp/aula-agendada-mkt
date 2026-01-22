import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.3)]',
        secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700',
        ghost: 'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-white/5',
        outline: 'border border-indigo-600/50 text-indigo-400 hover:bg-indigo-600/10',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg font-semibold',
    };

    return (
        <button
            className={cn(
                'relative inline-flex items-center justify-center rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                isLoading && 'text-transparent',
                className
            )}
            {...props}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </div>
            )}
            {children}
        </button>
    );
};
