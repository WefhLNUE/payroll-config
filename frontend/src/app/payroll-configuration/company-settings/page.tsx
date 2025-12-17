'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';
import CompanySettingsForm from '../components/CompanySettingsForm';

interface CompanySettings {
  _id?: string;
  payDate: string | Date;
  timeZone: string;
  currency: string;
  updatedAt?: string;
}

interface CompanySettingsFormData {
  payDate: string;
  timeZone: string;
  currency: string;
  updatedAt?: string;
}

export default function CompanySettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await apiClient.get('/payroll-configuration/company-settings');
      if (data) {
        // Format payDate for date input (YYYY-MM-DD)
        const formattedData = {
          ...data,
          payDate: data.payDate
            ? new Date(data.payDate).toISOString().split('T')[0]
            : '',
        };
        setSettings(formattedData);
      }
    } catch (err: any) {
      console.error('Error fetching company settings:', err);
      // If settings don't exist yet (404) or HTML response (route conflict), that's okay - it's first time setup
      // Only show error for other status codes
      const errorMessage = err.message || '';
      const is404 = errorMessage.includes('404') || errorMessage.includes('API Error: 404');
      const isHtmlResponse = errorMessage.includes('HTML instead of JSON') || errorMessage.includes('API endpoint not found');
      
      // Suppress errors for first-time setup (404 or HTML response from Next.js route conflict)
      if (!is404 && !isHtmlResponse) {
        setError('Failed to load settings');
      } else {
        // Clear error for first-time setup scenarios
        setError('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData: CompanySettingsFormData) => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        payDate: new Date(formData.payDate),
        timeZone: formData.timeZone,
        currency: formData.currency,
      };

      await apiClient.post('/payroll-configuration/company-settings', payload);
      setSuccess('Company settings saved successfully!');
      await fetchSettings();
    } catch (err: any) {
      const errorMessage = err.message || '';
      let displayError = 'Failed to save company settings';

      // Handle different error types
      if (errorMessage.includes('API endpoint not found') || errorMessage.includes('returned HTML')) {
        displayError = 'Backend server is not running or API endpoint is incorrect. Please check your backend connection.';
      } else if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
        displayError = errorMessage.includes('API Error: 400')
          ? errorMessage.replace('API Error: 400', '').trim() || 'Validation error. Please check your input.'
          : errorMessage;
      } else if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
        displayError = 'Server error, please try again';
      } else if (errorMessage) {
        displayError = errorMessage;
      }

      setError(displayError);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setError('');
    setSuccess('');
  };

  const getInitialData = (): CompanySettingsFormData | undefined => {
    if (!settings) return undefined;
    return {
      payDate: typeof settings.payDate === 'string' ? settings.payDate : new Date(settings.payDate).toISOString().split('T')[0],
      timeZone: settings.timeZone || '',
      currency: settings.currency || 'EGP',
      updatedAt: settings.updatedAt,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Company Settings</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
                {success}
              </div>
            )}

            <CompanySettingsForm
              initialData={getInitialData()}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
}

