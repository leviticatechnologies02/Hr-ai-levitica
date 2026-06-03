import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
    '3xl': 'max-w-6xl',
    max: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop with subtle blur */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div 
        className={`relative bg-white rounded-3xl shadow-deatail_shadow w-full ${sizeClasses[size] || sizeClasses.md} transform transition-all flex flex-col max-h-[90vh] overflow-hidden border border-slate-100`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
            aria-label="Close modal"
          >
            <Icon icon="heroicons:x-mark" className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-3 overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
