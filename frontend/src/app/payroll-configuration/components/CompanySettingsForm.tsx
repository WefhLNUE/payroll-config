'use client';

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { Form, FormField } from './Form';
import { Modal } from './Modal';

interface CompanySettingsData {
  payDate: string;
  timeZone: string;
  currency: string;
  updatedAt?: string;
}

interface CompanySettingsFormProps {
  initialData?: CompanySettingsData;
  onSave: (data: CompanySettingsData) => Promise<void>;
  onCancel: () => void;
}

const getTimezoneOffset = (timezone: string): string => {
  try {
    const now = new Date();
    const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tz = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const offset = (tz.getTime() - utc.getTime()) / (1000 * 60 * 60);
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.abs(Math.floor(offset));
    const minutes = Math.abs((offset % 1) * 60);
    return `UTC${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}`;
  } catch {
    return '';
  }
};

const timezoneGroups = [
  {
    label: 'Africa',
    timezones: [
      { value: 'Africa/Cairo', label: 'Africa/Cairo' },
      { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg' },
    ],
  },
  {
    label: 'Europe',
    timezones: [
      { value: 'Europe/London', label: 'Europe/London' },
      { value: 'Europe/Paris', label: 'Europe/Paris' },
    ],
  },
  {
    label: 'America',
    timezones: [
      { value: 'America/New_York', label: 'America/New_York' },
      { value: 'America/Los_Angeles', label: 'America/Los_Angeles' },
    ],
  },
  {
    label: 'Asia',
    timezones: [
      { value: 'Asia/Dubai', label: 'Asia/Dubai' },
      { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
    ],
  },
  {
    label: 'UTC',
    timezones: [{ value: 'UTC', label: 'UTC' }],
  },
];

const currencyOptions = [
  { label: 'EGP', value: 'EGP' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
  { label: 'AED', value: 'AED' },
];

export default function CompanySettingsForm({
  initialData,
  onSave,
  onCancel,
}: CompanySettingsFormProps) {
  const [formData, setFormData] = useState<CompanySettingsData>({
    payDate: initialData?.payDate || '',
    timeZone: initialData?.timeZone || '',
    currency: initialData?.currency || 'EGP',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    payDate?: string;
    timeZone?: string;
    currency?: string;
  }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const previousValuesRef = useRef<{
    timeZone?: string;
    currency?: string;
  }>({
    timeZone: initialData?.timeZone,
    currency: initialData?.currency,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        payDate: initialData.payDate || '',
        timeZone: initialData.timeZone || '',
        currency: initialData.currency || 'EGP',
      });
      previousValuesRef.current = {
        timeZone: initialData.timeZone,
        currency: initialData.currency,
      };
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const errors: { payDate?: string; timeZone?: string; currency?: string } = {};

    if (!formData.payDate) {
      errors.payDate = 'Pay date is required';
    }

    if (!formData.timeZone) {
      errors.timeZone = 'Timezone is required';
    }

    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof fieldErrors];
        return newErrors;
      });
    }
    
    setError('');
    setSuccess(false);
  };

  const checkForConfirmation = (): boolean => {
    const timezoneChanged =
      previousValuesRef.current.timeZone &&
      formData.timeZone !== previousValuesRef.current.timeZone;
    const currencyChanged =
      previousValuesRef.current.currency &&
      formData.currency !== previousValuesRef.current.currency;

    return timezoneChanged || currencyChanged;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check if confirmation is needed
    if (checkForConfirmation()) {
      setPendingSubmit(true);
      setShowConfirmModal(true);
      return;
    }

    await performSubmit();
  };

  const performSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccess(false);
    setFieldErrors({});

    try {
      await onSave(formData);
      setSuccess(true);
      // Update previous values after successful save
      previousValuesRef.current = {
        timeZone: formData.timeZone,
        currency: formData.currency,
      };
    } catch (err: any) {
      setError(err.message || 'Failed to save company settings');
    } finally {
      setIsSubmitting(false);
      setPendingSubmit(false);
    }
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    performSubmit();
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setPendingSubmit(false);
    // Revert to previous values
    if (previousValuesRef.current.timeZone) {
      setFormData((prev) => ({
        ...prev,
        timeZone: previousValuesRef.current.timeZone || prev.timeZone,
        currency: previousValuesRef.current.currency || prev.currency,
      }));
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData({
        payDate: initialData.payDate || '',
        timeZone: initialData.timeZone || '',
        currency: initialData.currency || 'EGP',
      });
    } else {
      setFormData({
        payDate: '',
        timeZone: '',
        currency: 'EGP',
      });
    }
    setError('');
    setSuccess(false);
    onCancel();
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string): string => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onCancel={handleCancel}
      submitLabel="Save"
      cancelLabel="Cancel"
    >
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
          Company settings saved successfully!
        </div>
      )}

      {initialData && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Settings</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pay Date:</span>
              <span className="font-medium text-gray-900">
                {initialData.payDate ? formatDate(initialData.payDate) : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timezone:</span>
              <span className="font-medium text-gray-900">
                {initialData.timeZone || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Currency:</span>
              <span className="font-medium text-gray-900">
                {initialData.currency || 'Not set'}
              </span>
            </div>
            {initialData.updatedAt && (
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium text-gray-900">
                  {formatDateTime(initialData.updatedAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Payroll Processing Date
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="date"
          name="payDate"
          value={formData.payDate}
          onChange={handleInputChange}
          required
          min={new Date().toISOString().split('T')[0]}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-black bg-white ${
            fieldErrors.payDate
              ? 'border-red-600 focus:ring-red-500'
              : 'border-gray-300'
          }`}
        />
        {fieldErrors.payDate && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.payDate}</p>
        )}
        <p className="text-sm text-gray-500 mb-4 mt-1">
          Date when payroll is processed each period
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Timezone
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          name="timeZone"
          value={formData.timeZone}
          onChange={handleInputChange}
          required
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-black bg-white ${
            fieldErrors.timeZone
              ? 'border-red-600 focus:ring-red-500'
              : 'border-gray-300'
          }`}
        >
          <option value="">Select Timezone</option>
          {timezoneGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.timezones.map((tz) => {
                const offset = getTimezoneOffset(tz.value);
                return (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} {offset && `(${offset})`}
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>
        {fieldErrors.timeZone && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.timeZone}</p>
        )}
        <p className="text-sm text-gray-500 mb-4 mt-1">
          Timezone for payroll processing
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Currency
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          name="currency"
          value={formData.currency}
          onChange={handleInputChange}
          required
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-black bg-white ${
            fieldErrors.currency
              ? 'border-red-600 focus:ring-red-500'
              : 'border-gray-300'
          }`}
        >
          <option value="">Select Currency</option>
          {currencyOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {fieldErrors.currency && (
          <p className="text-red-600 text-sm mt-1">{fieldErrors.currency}</p>
        )}
        <p className="text-sm text-gray-500 mb-4 mt-1">
          Default currency for payroll
        </p>
      </div>

      <Modal
        isOpen={showConfirmModal}
        title="Confirm Settings Change"
        onClose={handleCancelConfirm}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Changing these settings will affect all future payroll calculations. Continue?
          </p>
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleCancelConfirm}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

