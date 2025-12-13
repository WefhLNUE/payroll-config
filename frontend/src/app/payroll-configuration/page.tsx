'use client';

import { useState } from 'react';
import PayrollPolicies from './components/PayrollPolicies';
import PayGrades from './components/PayGrades';
import PayTypes from './components/PayTypes';
import Allowances from './components/Allowances';
import SigningBonuses from './components/SigningBonuses';
import TerminationBenefits from './components/TerminationBenefits';

type TabType = 'policies' | 'grades' | 'types' | 'allowances' | 'bonuses' | 'termination';

export default function PayrollConfiguration() {
  const [activeTab, setActiveTab] = useState<TabType>('policies');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'policies', label: 'Payroll Policies', icon: '📋' },
    { id: 'grades', label: 'Pay Grades', icon: '📊' },
    { id: 'types', label: 'Pay Types', icon: '💰' },
    { id: 'allowances', label: 'Allowances', icon: '➕' },
    { id: 'bonuses', label: 'Signing Bonuses', icon: '🎁' },
    { id: 'termination', label: 'Termination Benefits', icon: '🚪' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payroll Configuration</h1>
          <p className="text-gray-600">Manage payroll policies, pay grades, and compensation structures</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'policies' && <PayrollPolicies />}
          {activeTab === 'grades' && <PayGrades />}
          {activeTab === 'types' && <PayTypes />}
          {activeTab === 'allowances' && <Allowances />}
          {activeTab === 'bonuses' && <SigningBonuses />}
          {activeTab === 'termination' && <TerminationBenefits />}
        </div>
      </div>
    </div>
  );
}
