import React from 'react';

const Button = ({
  children,
  onClick,
  className = '',
  variant = 'default',
  size = 'md',
  type = 'button',
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    default: 'btn-default',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || ''} ${className}`.trim();

  return (
    <button type={type} className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export { Button };
