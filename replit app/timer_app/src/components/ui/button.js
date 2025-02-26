import React from 'react';

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false }) => {
    const baseStyles = "rounded p-2 focus:outline-none";
    const variantStyles = variant === 'outline' ? "border border-gray-300" : "bg-blue-500 text-white";
    const sizeStyles = size === 'lg' ? "text-lg" : size === 'sm' ? "text-sm" : "text-base";

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${sizeStyles} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={disabled ? null : onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;