import React, { useState, useRef, useCallback, useId } from 'react';

interface DisclosureProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ label, children, defaultOpen = false }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const buttonId = useId();

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }, [toggle]);

  return (
    <div>
      <button
        ref={buttonRef}
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          background: '#f9f9f9',
          cursor: 'pointer',
          textAlign: 'left',
          fontWeight: 'bold',
        }}
      >
        <span
          style={{
            marginRight: '8px',
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        >
          ▶
        </span>
        {label}
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        style={{
          padding: isOpen ? '16px' : '0',
          border: isOpen ? '1px solid #ccc' : 'none',
          borderTop: 'none',
          borderRadius: '0 0 4px 4px',
          marginTop: '-1px',
        }}
      >
        {children}
      </div>
    </div>
  );
}
