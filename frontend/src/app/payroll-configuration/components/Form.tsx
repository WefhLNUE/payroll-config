'use client';

import { ChangeEvent, FormEvent, ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  children?: ReactNode;
  options?: { label: string; value: string | number }[];
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  placeholder,
  children,
  options,
}: FormFieldProps) {
  const baseInputStyles =
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-black bg-white';

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className={`${baseInputStyles} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          rows={4}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`${baseInputStyles} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        >
          <option value="">Select {label}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className={`${baseInputStyles} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

interface FormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

export function Form({ onSubmit, children, isSubmitting = false, submitLabel = 'Save', cancelLabel = 'Cancel', onCancel }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {children}
      <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            disabled={isSubmitting}
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && <span className="animate-spin">⌛</span>}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
