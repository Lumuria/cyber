import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'default', ...props }) => {
  const baseClasses = 'btn';
  const variantClasses = {
    default: 'btn-default',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export { Button };
