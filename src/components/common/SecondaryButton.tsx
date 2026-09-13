import React from 'react';

export interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'outline' | 'ghost' | 'secondary';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  label,
  loading = false,
  icon,
  fullWidth = true,
  variant = 'secondary',
  disabled,
  className = '',
  ...props
}) => {
  const styles = {
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80',
    outline: 'bg-transparent text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-300',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 border-none',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        relative flex items-center justify-center gap-2 px-4 py-3 
        rounded-xl font-medium text-sm transition-all duration-150 active:scale-[0.98]
        disabled:opacity-50 disabled:pointer-events-none
        ${styles[variant]}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {icon && <span className="flex items-center text-current">{icon}</span>}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
