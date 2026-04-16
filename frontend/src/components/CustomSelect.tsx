import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`custom-select-container ${className}`} ref={containerRef} style={{ position: 'relative', minWidth: '200px' }}>
      <div 
        className="liquid-glass select-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          padding: '12px 20px', 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRadius: '16px'
        }}
      >
        <span style={{ fontWeight: 500 }}>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease', color: '#cc3300' }} />
      </div>

      {isOpen && (
        <div 
          className="liquid-glass select-dropdown-menu"
          style={{ 
            position: 'absolute', 
            top: 'calc(100% + 12px)', 
            left: 0, 
            width: '100%', 
            zIndex: 1000001,
            padding: '12px',
            background: '#ffffff',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            animation: 'dropdownEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {options.map(option => (
            <div 
              key={option.value}
              className="option-item"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              style={{ 
                padding: '10px 15px', 
                borderRadius: '8px', 
                cursor: 'pointer',
                background: value === option.value ? 'rgba(255, 102, 0, 0.1)' : 'transparent',
                color: value === option.value ? '#cc3300' : '#121212',
                fontWeight: value === option.value ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
