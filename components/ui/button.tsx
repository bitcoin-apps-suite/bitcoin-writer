import React from 'react';
export function Button({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return <button className={className} {...props}>{children}</button>;
}
