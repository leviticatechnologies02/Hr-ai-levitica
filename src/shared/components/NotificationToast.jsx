import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';

const NotificationToast = ({ message, type = 'success', isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    success: 'bg-emerald-600',
    error: 'bg-rose-600',
    warning: 'bg-amber-600',
    info: 'bg-blue-600'
  };

  const iconMap = {
    success: 'heroicons:check-circle',
    error: 'heroicons:x-circle',
    warning: 'heroicons:exclamation-triangle',
    info: 'heroicons:information-circle'
  };

  return (
    <div className={`fixed top-4 right-4 z-[2000] ${typeStyles[type] || typeStyles.info} text-white rounded-xl shadow-lg p-4 max-w-md animate-slide-in`}>
      <div className="flex items-start gap-3">
        <Icon icon={iconMap[type] || iconMap.info} className="w-6 h-6 flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <Icon icon="heroicons:x-mark" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;