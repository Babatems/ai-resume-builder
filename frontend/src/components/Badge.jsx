import React from 'react';

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) {
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-accent-100 text-accent-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    neutral: 'bg-neutral-100 text-neutral-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs font-medium',
    md: 'px-3 py-1.5 text-sm font-semibold',
    lg: 'px-4 py-2 text-base font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
