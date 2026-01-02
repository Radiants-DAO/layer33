'use client';

import React, { useState, useRef, useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  /** Available options */
  options: SelectOption[];
  /** Currently selected value */
  value?: string;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Additional classes */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Custom select/dropdown with retro styling
 */
export function Select({
  options,
  value,
  placeholder = 'Select...',
  onChange,
  disabled = false,
  error = false,
  fullWidth = false,
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? 'w-full' : 'w-fit'} ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center justify-between gap-2
          w-full h-10 px-3
          font-alfacad text-base
          bg-white text-black
          border border-black rounded-none
          ${error ? 'ring-2 ring-accent-1' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'shadow-[4px_4px_0_0_black] -translate-y-0.5' : 'shadow-[2px_2px_0_0_black]'}
        `}
      >
        <span className={selectedOption ? 'text-black' : 'text-neutral-neutral-3'}>
          {selectedOption?.label || placeholder}
        </span>
        <span className={`text-black text-xs ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 top-full left-0 right-0 mt-1
            bg-white
            border border-black
            rounded-none
            shadow-[2px_2px_0_0_var(--color-black)]
            overflow-hidden
          `}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => !option.disabled && handleSelect(option.value)}
              disabled={option.disabled}
              className={`
                w-full px-3 py-2
                font-alfacad text-base text-left
                ${option.value === value ? 'bg-green text-black' : 'text-black'}
                ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green cursor-pointer'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Select;

