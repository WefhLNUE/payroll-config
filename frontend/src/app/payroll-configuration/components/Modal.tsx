'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, title, children, onClose, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-xl ${sizeStyles[size]}`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
