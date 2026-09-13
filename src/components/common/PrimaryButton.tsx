import React from 'react';

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'primary' | 'danger' | 'success';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  loading = false,
  icon,
  fullWidth = true,
  variant = 'primary',
  disabled,
  className = '',
  ...props
}) => {
  const bgStyles = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20',
    danger: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold shadow-sm',
    success: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-600/20',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        relative flex items-center justify-center gap-2 px-5 py-3.5 
        rounded-2xl text-sm transition-all duration-150 active:scale-[0.98] cursor-pointer
        disabled:opacity-60 disabled:pointer-events-none disabled:transform-none
        ${bgStyles[variant]}
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
