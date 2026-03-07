import React from 'react';

export default function Input({
  label,
  error,
  success,
  icon,
  type = 'text',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const baseClasses = 'w-full rounded-lg border-2 transition-all duration-200 focus:outline-none';

  const stateClasses = error
    ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
    : success
    ? 'border-accent-500 focus:border-accent-600 focus:ring-2 focus:ring-accent-200'
    : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200';

  const finalClasses = `${baseClasses} ${sizes[size]} ${stateClasses} ${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</div>}
        <input
          type={type}
          className={`${finalClasses} ${icon ? 'pl-10' : ''}`}
          {...props}
        />
        {success && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-500">✓</div>
        )}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">!</div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {props.hint && <p className="text-neutral-500 text-sm mt-1">{props.hint}</p>}
    </div>
  );
}
