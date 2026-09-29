import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-gradient-gold text-ink-900 hover:shadow-gold hover:brightness-105 font-semibold',
  secondary: 'bg-ink-900 text-nude-50 hover:bg-ink-800 font-medium',
  outline: 'border-2 border-ink-300 text-ink-800 hover:border-gold-400 hover:text-gold-700 font-medium',
  ghost: 'text-ink-700 hover:bg-ink-100 font-medium',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1da851] font-semibold',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-xl',
};

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
