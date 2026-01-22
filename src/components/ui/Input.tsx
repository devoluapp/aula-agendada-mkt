import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium text-zinc-400 ml-1">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    'w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 transition-all duration-200',
                    error && 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500',
                    className
                )}
                {...props}
            />
            {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
        </div>
    );
};
