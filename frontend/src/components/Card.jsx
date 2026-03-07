import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
  children,
  variant = 'default',
  hover = false,
  className = '',
  ...props
}) {
  const variants = {
    default: 'bg-white border border-neutral-200',
    elevated: 'bg-white shadow-medium',
    outlined: 'bg-white border-2 border-primary-200',
    gradient: 'bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100',
  };

  const hoverEffect = hover ? 'hover:shadow-large hover:-translate-y-1' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl p-6 transition-all duration-300 ${variants[variant]} ${hoverEffect} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
