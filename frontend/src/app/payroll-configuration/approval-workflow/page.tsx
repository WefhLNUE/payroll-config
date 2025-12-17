'use client';

import { useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { CRUDTable } from '../components/CRUDTable';
import { StatusBadge } from '../components/StatusBadge';
import { apiClient } from '../lib/apiClient';
import ApprovalModal from '../components/ApprovalModal';
import RejectionModal from '../components/RejectionModal';
import { ToastProvider, useToast } from '../components/ToastProvider';
import { UserProvider, useUser, UserRole } from '../lib/userContext';
import { Modal } from '../components/Modal';

type TabType = 'all' | 'pay-types' | 'pay-grades' | 'payroll-policies' | 'allowances' | 'insurance-brackets';

interface PendingItem {
  _id: string;
  name?: string;
  type?: string;
  grade?: string;
  policyName?: string;
  amount?: number;
  status: 'draft';
  createdAt: Date | string;
  [key: string]: any;
}

function ApprovalWorkflowContent() {
  const { showToast } = useToast();
  const { user, setRole } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [allPendingItems, setAllPendingItems] = useState<Record<TabType, PendingItem[]>>({
    'all': [],
    'pay-types': [],
    'pay-grades': [],
    'payroll-policies': [],
    'allowances': [],
    'insurance-brackets': [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
  const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number; message: string } | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<string>('all');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'pay-types', label: 'Pay Types', icon: '💰' },
    { id: 'pay-grades', label: 'Pay Grades', icon: '📊' },
    { id: 'payroll-policies', label: 'Payroll Policies', icon: '📋' },
    { id: 'allowances', label: 'Allowances', icon: '➕' },
    { id: 'insurance-brackets', label: 'Insurance Brackets', icon: '🛡️' },
  ];

  // API helper functions
  const approveItem = async (type: string, id: string, approvedBy: string) => {
    const endpoints: Record<string, string> = {
      'pay-types': `/payroll-configuration/pay-types/${id}/approve`,
      'pay-grades': `/payroll-configuration/pay-grades/${id}/approve`,
      'payroll-policies': `/payroll-configuration/payroll-policies/${id}/approve`,
      'allowances': `/payroll-configuration/allowances/${id}/status`,
      'insurance-brackets': `/payroll-configuration/insurance-brackets/${id}/status`,
    };

    const endpoint = endpoints[type];
    if (!endpoint) {
      throw new Error(`Unknown configuration type: ${type}`);
    }

    // For pay-types, pay-grades, payroll-policies: POST with { approvedBy }
    if (['pay-types', 'pay-grades', 'payroll-policies'].includes(type)) {
      await apiClient.post(endpoint, { approvedBy });
    } else {
      // For allowances, insurance-brackets: PATCH with { status: 'approved', approverId: approvedBy }
      await apiClient.patch(endpoint, { status: 'approved', approverId: approvedBy });
    }
  };

  const rejectItem = async (type: string, id: string, rejectedBy: string, reason: string) => {
    const endpoints: Record<string, string> = {
      'pay-types': `/payroll-configuration/pay-types/${id}/reject`,
      'pay-grades': `/payroll-configuration/pay-grades/${id}/reject`,
      'payroll-policies': `/payroll-configuration/payroll-policies/${id}/reject`,
      'allowances': `/payroll-configuration/allowances/${id}/status`,
      'insurance-brackets': `/payroll-configuration/insurance-brackets/${id}/status`,
    };

    const endpoint = endpoints[type];
    if (!endpoint) {
      throw new Error(`Unknown configuration type: ${type}`);
    }

    // For pay-types, pay-grades, payroll-policies: POST with { rejectedBy, reason }
    if (['pay-types', 'pay-grades', 'payroll-policies'].includes(type)) {
      await apiClient.post(endpoint, { rejectedBy, reason });
    } else {
      // For allowances, insurance-brackets: PATCH with { status: 'rejected', approverId: rejectedBy }
      await apiClient.patch(endpoint, { status: 'rejected', approverId: rejectedBy });
    }
  };

  // Fetch pending items for each type
  const fetchPendingItems = async (showLoadingToast = false) => {
    setIsLoading(true);
    setError('');

    try {
      if (showLoadingToast) {
        showToast('Loading pending items...', 'info');
      }
      const [payTypes, payGrades, policies, allowances, insuranceBrackets] = await Promise.all([
        apiClient.get('/payroll-configuration/pay-types?status=draft').catch(() => []),
        apiClient.get('/payroll-configuration/pay-grades?status=draft').catch(() => []),
        apiClient.get('/payroll-configuration/payroll-policies?status=draft').catch(() => []),
        apiClient.get('/payroll-configuration/allowances?status=draft').catch(() => []),
        apiClient.get('/payroll-configuration/insurance-brackets?status=draft').catch(() => []),
      ]);

      // Add type metadata to each item
      const typedPayTypes = (payTypes || []).map((item: any) => ({ ...item, itemType: 'pay-types' }));
      const typedPayGrades = (payGrades || []).map((item: any) => ({ ...item, itemType: 'pay-grades' }));
      const typedPolicies = (policies || []).map((item: any) => ({ ...item, itemType: 'payroll-policies' }));
      const typedAllowances = (allowances || []).map((item: any) => ({ ...item, itemType: 'allowances' }));
      const typedInsuranceBrackets = (insuranceBrackets || []).map((item: any) => ({ ...item, itemType: 'insurance-brackets' }));

      // Store all items by type
      const allItems: Record<TabType, PendingItem[]> = {
        'all': [...typedPayTypes, ...typedPayGrades, ...typedPolicies, ...typedAllowances, ...typedInsuranceBrackets],
        'pay-types': typedPayTypes,
        'pay-grades': typedPayGrades,
        'payroll-policies': typedPolicies,
        'allowances': typedAllowances,
        'insurance-brackets': typedInsuranceBrackets,
      };

      setAllPendingItems(allItems);
    } catch (err: any) {
      console.error('Error fetching pending items:', err);
      const errorMessage = err.message || 'Failed to load pending configurations';
      setError(errorMessage);
      showToast(`Failed to load items: ${errorMessage}`, 'error');
      setAllPendingItems({
        'all': [],
        'pay-types': [],
        'pay-grades': [],
        'payroll-policies': [],
        'allowances': [],
        'insurance-brackets': [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchPendingItems(true);
  }, []);

  // Debounce search input (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get unique creators from all items
  const uniqueCreators = useMemo(() => {
    const allItems = allPendingItems['all'] || [];
    const creators = new Set<string>();
    allItems.forEach((item) => {
      if (item.createdBy) {
        creators.add(item.createdBy);
      }
    });
    return Array.from(creators).sort();
  }, [allPendingItems]);

  // Filter items based on active filters
  const filteredItems = useMemo(() => {
    let items = allPendingItems[activeTab] || [];

    // Search filter (case-insensitive, search in name and description)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      items = items.filter((item) => {
        const name = (item.name || item.grade || item.policyName || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        return name.includes(query) || description.includes(query);
      });
    }

    // Date range filter
    if (dateFrom || dateTo) {
      items = items.filter((item) => {
        if (!item.createdAt) return false;
        const itemDate = new Date(item.createdAt);
        itemDate.setHours(0, 0, 0, 0);
        
        if (dateFrom) {
          const fromDate = new Date(dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          if (itemDate < fromDate) return false;
        }
        
        if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (itemDate > toDate) return false;
        }
        
        return true;
      });
    }

    // Creator filter
    if (selectedCreator !== 'all') {
      items = items.filter((item) => item.createdBy === selectedCreator);
    }

    return items;
  }, [allPendingItems, activeTab, debouncedSearchQuery, dateFrom, dateTo, selectedCreator]);

  // Get current items (filtered)
  const currentItems = filteredItems;
  const itemCount = currentItems.length;
  const unfilteredCount = allPendingItems[activeTab]?.length || 0;

  // Get selected items
  const selectedItems = currentItems.filter((item) => selectedIds.includes(item._id));

  // Check if all selected items are of the same type
  const getSelectedItemsType = (): string | null => {
    if (selectedItems.length === 0) return null;
    const firstType = selectedItems[0].itemType || activeTab;
    const allSameType = selectedItems.every((item) => (item.itemType || activeTab) === firstType);
    return allSameType ? firstType : null;
  };

  const selectedItemsType = getSelectedItemsType();
  const canBulkAction = selectedItems.length > 0 && selectedItemsType !== null;

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return debouncedSearchQuery.trim() !== '' || dateFrom !== '' || dateTo !== '' || selectedCreator !== 'all';
  }, [debouncedSearchQuery, dateFrom, dateTo, selectedCreator]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setSelectedCreator('all');
  }, []);

  // Get tab label with count
  const getTabLabel = (tab: { id: TabType; label: string; icon: string }): string => {
    const count = allPendingItems[tab.id]?.length || 0;
    return `${tab.label} (${count})`;
  };

  // Normalize item for modal (extract name and type)
  const normalizeItemForModal = (item: PendingItem) => {
    const name = item.name || item.grade || item.policyName || 'Unknown';
    const type = item.itemType || 'configuration';
    return {
      _id: item._id,
      name,
      type,
      createdAt: item.createdAt,
    };
  };

  const handleApprove = (item: PendingItem) => {
    if (isLoading || isProcessing) return;
    setSelectedItem(item);
    setShowApprovalModal(true);
  };

  const handleReject = (item: PendingItem) => {
    if (isLoading || isProcessing) return;
    setSelectedItem(item);
    setShowRejectionModal(true);
  };

  const handleApproveConfirm = async (approvedBy: string) => {
    if (!selectedItem) return;

    setIsProcessing(true);
    setProcessingItemId(selectedItem._id);
    setError('');

    try {
      const itemType = selectedItem.itemType || activeTab;
      await approveItem(itemType, selectedItem._id, approvedBy);
      showToast('Configuration approved successfully', 'success');
      setShowApprovalModal(false);
      setSelectedItem(null);
      setProcessingItemId(null);
      await fetchPendingItems();
    } catch (err: any) {
      console.error('Error approving item:', err);
      const errorMessage = err.message || 'Failed to approve configuration';
      setError(errorMessage);
      showToast(`Failed to approve: ${errorMessage}`, 'error');
      setProcessingItemId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async (rejectedBy: string, reason: string) => {
    if (!selectedItem) return;

    setIsProcessing(true);
    setProcessingItemId(selectedItem._id);
    setError('');

    try {
      const itemType = selectedItem.itemType || activeTab;
      await rejectItem(itemType, selectedItem._id, rejectedBy, reason);
      showToast('Configuration rejected', 'success');
      setShowRejectionModal(false);
      setSelectedItem(null);
      setProcessingItemId(null);
      await fetchPendingItems();
    } catch (err: any) {
      console.error('Error rejecting item:', err);
      const errorMessage = err.message || 'Failed to reject configuration';
      setError(errorMessage);
      showToast(`Failed to reject: ${errorMessage}`, 'error');
      setProcessingItemId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveCancel = () => {
    setShowApprovalModal(false);
    setSelectedItem(null);
  };

  const handleRejectCancel = () => {
    setShowRejectionModal(false);
    setSelectedItem(null);
  };

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewItem, setViewItem] = useState<PendingItem | null>(null);

  const handleViewDetails = (item: PendingItem) => {
    setViewItem(item);
    setShowViewModal(true);
  };

  // Bulk actions
  const handleBulkApprove = async (approvedBy: string) => {
    if (!selectedItemsType || selectedItems.length === 0) return;

    setBulkProgress({ current: 0, total: selectedItems.length, message: 'Starting bulk approval...' });
    const results: { success: string[]; failed: Array<{ id: string; error: string }> } = {
      success: [],
      failed: [],
    };

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      setBulkProgress({
        current: i + 1,
        total: selectedItems.length,
        message: `Approving ${i + 1} of ${selectedItems.length}...`,
      });

      try {
        await approveItem(selectedItemsType, item._id, approvedBy);
        results.success.push(item._id);
      } catch (err: any) {
        results.failed.push({
          id: item._id,
          error: err.message || 'Failed to approve',
        });
      }
    }

    setBulkProgress(null);
    setShowBulkApproveModal(false);

    // Show summary
    if (results.failed.length === 0) {
      showToast(`Successfully approved ${results.success.length} items`, 'success');
      setSelectedIds([]);
    } else {
      showToast(
        `Approved ${results.success.length} items, ${results.failed.length} failed`,
        results.success.length > 0 ? 'warning' : 'error'
      );
      // Keep only failed items selected
      setSelectedIds(results.failed.map((f) => f.id));
    }

    await fetchPendingItems();
  };

  const handleBulkReject = async (rejectedBy: string, reason: string) => {
    if (!selectedItemsType || selectedItems.length === 0) return;

    setBulkProgress({ current: 0, total: selectedItems.length, message: 'Starting bulk rejection...' });
    const results: { success: string[]; failed: Array<{ id: string; error: string }> } = {
      success: [],
      failed: [],
    };

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      setBulkProgress({
        current: i + 1,
        total: selectedItems.length,
        message: `Rejecting ${i + 1} of ${selectedItems.length}...`,
      });

      try {
        await rejectItem(selectedItemsType, item._id, rejectedBy, reason);
        results.success.push(item._id);
      } catch (err: any) {
        results.failed.push({
          id: item._id,
          error: err.message || 'Failed to reject',
        });
      }
    }

    setBulkProgress(null);
    setShowBulkRejectModal(false);

    // Show summary
    if (results.failed.length === 0) {
      showToast(`Successfully rejected ${results.success.length} items`, 'success');
      setSelectedIds([]);
    } else {
      showToast(
        `Rejected ${results.success.length} items, ${results.failed.length} failed`,
        results.success.length > 0 ? 'warning' : 'error'
      );
      // Keep only failed items selected
      setSelectedIds(results.failed.map((f) => f.id));
    }

    await fetchPendingItems();
  };

  // Define columns based on active tab (with responsive visibility)
  const getColumns = () => {
    const baseColumns: Array<{
      key: string;
      label: string;
      render?: (value: any, row: any) => ReactNode;
      hideOnMobile?: boolean;
      hideOnTablet?: boolean;
    }> = [];
    
    switch (activeTab) {
      case 'pay-types':
        baseColumns.push(
          { key: 'type', label: 'Type', render: (value: string) => value?.charAt(0).toUpperCase() + value?.slice(1) },
          { key: 'amount', label: 'Amount', render: (value: number) => `$${value?.toLocaleString()}` },
          { key: 'status', label: 'Status', render: (value: string) => <StatusBadge status={value as 'draft' | 'approved' | 'rejected'} /> }
        );
        break;
      case 'pay-grades':
        baseColumns.push(
          { key: 'grade', label: 'Grade' },
          { key: 'baseSalary', label: 'Base Salary', render: (value: number) => `$${value?.toLocaleString()}`, hideOnMobile: true },
          { key: 'grossSalary', label: 'Gross Salary', render: (value: number) => `$${value?.toLocaleString()}`, hideOnMobile: true },
          { key: 'status', label: 'Status', render: (value: string) => <StatusBadge status={value as 'draft' | 'approved' | 'rejected'} /> }
        );
        break;
      case 'payroll-policies':
        baseColumns.push(
          { key: 'policyName', label: 'Policy Name' },
          { key: 'policyType', label: 'Policy Type', hideOnMobile: true },
          { key: 'status', label: 'Status', render: (value: string) => <StatusBadge status={value as 'draft' | 'approved' | 'rejected'} /> }
        );
        break;
      case 'allowances':
        baseColumns.push(
          { key: 'name', label: 'Name' },
          { key: 'amount', label: 'Amount', render: (value: number) => `$${value?.toLocaleString()}` },
          { key: 'status', label: 'Status', render: (value: string) => <StatusBadge status={value as 'draft' | 'approved' | 'rejected'} /> }
        );
        break;
      case 'insurance-brackets':
        baseColumns.push(
          { key: 'name', label: 'Name' },
          { key: 'minSalary', label: 'Min Salary', render: (value: number) => `$${value?.toLocaleString()}`, hideOnMobile: true },
          { key: 'maxSalary', label: 'Max Salary', render: (value: number) => `$${value?.toLocaleString()}`, hideOnMobile: true },
          { key: 'status', label: 'Status', render: (value: string) => <StatusBadge status={value as 'draft' | 'approved' | 'rejected'} /> }
        );
        break;
      default: // 'all'
        baseColumns.push(
          { key: 'name', label: 'Name', render: (value: any, row: any) => row.name || row.grade || row.policyName || 'N/A' },
          { key: 'type', label: 'Type', render: (value: any, row: any) => {
            if (row.type) return 'Pay Type';
            if (row.grade) return 'Pay Grade';
            if (row.policyName) return 'Payroll Policy';
            if (row.name && row.amount && row.itemType === 'insurance-brackets') return 'Insurance Bracket';
            if (row.name && row.amount) return 'Allowance';
            return 'Unknown';
          }},
          { key: 'status', label: 'Status', render: (value: string) => <StatusBadge status={value as 'draft' | 'approved' | 'rejected'} /> }
        );
    }
    
    // Add badge column for insurance brackets if user can't approve (for 'all' tab)
    if (activeTab === 'all' && user.role !== 'HRManager') {
      baseColumns.splice(1, 0, {
        key: 'approvalBadge',
        label: '',
        render: (value: any, row: any) => {
          if (row.itemType === 'insurance-brackets') {
            return (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                HR Manager Approval Required
              </span>
            );
          }
          return null;
        },
      });
    }
    
    // Add Actions column with Approve, Reject, View buttons
    baseColumns.push({
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: PendingItem) => {
        const isProcessingThisItem = processingItemId === row._id;
        const itemType = row.itemType || activeTab;
        const canApprove = canApproveItemType(itemType);
        const requiredRole = getRequiredRole(itemType);
        const isInsuranceBracket = itemType === 'insurance-brackets';
        
        return (
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button
              onClick={() => handleViewDetails(row)}
              disabled={isLoading || isProcessing}
              aria-label={`View details for ${row.name || row.grade || row.policyName || 'item'}`}
              className="px-2 sm:px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs sm:text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View
            </button>
            <div className="relative group">
              <button
                onClick={() => handleApprove(row)}
                disabled={isLoading || isProcessing || isProcessingThisItem || !canApprove}
                aria-label={`Approve ${row.name || row.grade || row.policyName || 'item'}`}
                title={!canApprove ? `Only ${requiredRole} can approve this type` : ''}
                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition flex items-center justify-center gap-1 ${
                  canApprove
                    ? 'text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                }`}
              >
                {!canApprove && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                {isProcessingThisItem && canApprove && (
                  <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Approve
              </button>
              {!canApprove && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  Only {requiredRole} can approve this type
                </div>
              )}
            </div>
            <button
              onClick={() => handleReject(row)}
              disabled={isLoading || isProcessing || isProcessingThisItem || !canApprove}
              aria-label={`Reject ${row.name || row.grade || row.policyName || 'item'}`}
              title={!canApprove ? `Only ${requiredRole} can reject this type` : ''}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition flex items-center justify-center gap-1 ${
                canApprove
                  ? 'text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
              }`}
            >
              {isProcessingThisItem && canApprove && (
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Reject
            </button>
          </div>
        );
      },
    });
    
    // Add badge column for insurance brackets if user can't approve
    if (activeTab === 'insurance-brackets' && user.role !== 'HRManager') {
      baseColumns.unshift({
        key: 'approvalBadge',
        label: '',
        render: () => (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            HR Manager Approval Required
          </span>
        ),
      });
    }
    
    return baseColumns;
  };

  // Check if user can approve a specific item type
  const canApproveItemType = (itemType: string): boolean => {
    if (user.role === 'PayrollManager') {
      return ['pay-types', 'pay-grades', 'payroll-policies', 'allowances'].includes(itemType);
    } else if (user.role === 'HRManager') {
      return itemType === 'insurance-brackets';
    }
    return false;
  };

  // Get required role for an item type
  const getRequiredRole = (itemType: string): string => {
    if (itemType === 'insurance-brackets') {
      return 'HR Manager';
    }
    return 'Payroll Manager';
  };

  // Handle keyboard navigation for tabs
  const handleTabKeyDown = (e: React.KeyboardEvent, tabId: TabType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(tabId);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const currentIndex = tabs.findIndex((t) => t.id === activeTab);
      const nextIndex = e.key === 'ArrowRight' 
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[nextIndex].id);
      // Focus the new tab button
      const nextTabButton = document.querySelector(`[data-tab-id="${tabs[nextIndex].id}"]`) as HTMLElement;
      nextTabButton?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Bar at Top */}
      {(isLoading || isProcessing) && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
          <div className="h-full bg-blue-600 animate-pulse" style={{ width: '100%' }}></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Warning Message */}
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Role-based access control is simulated. Will be replaced with actual auth.
          </p>
        </div>

        <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Approval Workflow Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600">Review and approve pending configurations</p>
          </div>
          
          {/* Role Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="role-selector" className="text-sm font-medium text-gray-700">
              Switch Role:
            </label>
            <select
              id="role-selector"
              value={user.role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              aria-label="Switch user role"
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="PayrollManager">Payroll Manager</option>
              <option value="HRManager">HR Manager</option>
            </select>
            <span className="text-xs text-gray-500 hidden sm:inline">(Demo)</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-8 border-b border-gray-200 overflow-x-auto" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`px-2 sm:px-4 py-2 sm:py-3 font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t`}
            >
              <span className="mr-1 sm:mr-2">{tab.icon}</span>
              <span className="text-xs sm:text-sm md:text-base">{getTabLabel(tab)}</span>
              {isLoading && activeTab === tab.id && (
                <span className="ml-2 inline-block">
                  <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow" role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          <div className="p-3 sm:p-6">
            {/* Error State with Retry */}
            {error && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded mb-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium mb-1">Error loading data</p>
                  <p className="text-sm">{error}</p>
                </div>
                <button
                  onClick={() => fetchPendingItems(true)}
                  aria-label="Retry loading data"
                  className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Filter Controls */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
                {/* Search Box */}
                <div className="flex-1 w-full sm:min-w-[200px]">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or description..."
                    aria-label="Search configurations"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                {/* Date Range Filter */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="flex-1 sm:flex-none">
                    <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                      From
                    </label>
                    <input
                      id="dateFrom"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      aria-label="Filter from date"
                      className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>
                  <div className="flex-1 sm:flex-none">
                    <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                      To
                    </label>
                    <div className="flex gap-1">
                      <input
                        id="dateTo"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        min={dateFrom}
                        aria-label="Filter to date"
                        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                      {(dateFrom || dateTo) && (
                        <button
                          onClick={() => {
                            setDateFrom('');
                            setDateTo('');
                          }}
                          aria-label="Clear date filter"
                          className="px-2 py-2 text-sm text-gray-600 hover:text-gray-800 self-end"
                          title="Clear date filter"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Creator Filter */}
                <div className="w-full sm:min-w-[180px]">
                  <label htmlFor="creator" className="block text-sm font-medium text-gray-700 mb-1">
                    Creator
                  </label>
                  <select
                    id="creator"
                    value={selectedCreator}
                    onChange={(e) => setSelectedCreator(e.target.value)}
                    aria-label="Filter by creator"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="all">All Creators</option>
                    {uniqueCreators.map((creator) => (
                      <option key={creator} value={creator}>
                        {creator}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    aria-label="Clear all filters"
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Filter Results Count */}
              {hasActiveFilters && (
                <div className="mt-3 text-xs sm:text-sm text-gray-600">
                  Showing {itemCount} of {unfilteredCount} items
                </div>
              )}
            </div>

            {/* Table with responsive wrapper */}
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <CRUDTable
                data={currentItems}
                columns={getColumns()}
                isLoading={isLoading}
                emptyMessage={hasActiveFilters ? "No items match your filters" : "No pending approvals"}
                processingItemId={processingItemId}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            </div>
          </div>
        </div>

        {/* Approval Modal */}
        <ApprovalModal
          isOpen={showApprovalModal}
          item={selectedItem ? normalizeItemForModal(selectedItem) : null}
          onConfirm={handleApproveConfirm}
          onCancel={handleApproveCancel}
          isLoading={isProcessing}
        />

        {/* Rejection Modal */}
        <RejectionModal
          isOpen={showRejectionModal}
          item={selectedItem ? normalizeItemForModal(selectedItem) : null}
          onConfirm={handleRejectConfirm}
          onCancel={handleRejectCancel}
          isLoading={isProcessing}
        />

        {/* View Details Modal */}
        {viewItem && (
          <Modal
            isOpen={showViewModal}
            title="Configuration Details"
            onClose={() => {
              setShowViewModal(false);
              setViewItem(null);
            }}
            size="lg"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <p className="text-gray-900">{viewItem.name || viewItem.grade || viewItem.policyName || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Type:</span>
                  <p className="text-gray-900">{viewItem.itemType || activeTab}</p>
                </div>
                {viewItem.type && (
                  <div>
                    <span className="font-medium text-gray-600">Pay Type:</span>
                    <p className="text-gray-900">{viewItem.type}</p>
                  </div>
                )}
                {viewItem.amount && (
                  <div>
                    <span className="font-medium text-gray-600">Amount:</span>
                    <p className="text-gray-900">${viewItem.amount.toLocaleString()}</p>
                  </div>
                )}
                {viewItem.baseSalary && (
                  <div>
                    <span className="font-medium text-gray-600">Base Salary:</span>
                    <p className="text-gray-900">${viewItem.baseSalary.toLocaleString()}</p>
                  </div>
                )}
                {viewItem.grossSalary && (
                  <div>
                    <span className="font-medium text-gray-600">Gross Salary:</span>
                    <p className="text-gray-900">${viewItem.grossSalary.toLocaleString()}</p>
                  </div>
                )}
                {viewItem.policyType && (
                  <div>
                    <span className="font-medium text-gray-600">Policy Type:</span>
                    <p className="text-gray-900">{viewItem.policyType}</p>
                  </div>
                )}
                {viewItem.createdAt && (
                  <div>
                    <span className="font-medium text-gray-600">Created Date:</span>
                    <p className="text-gray-900">
                      {new Date(viewItem.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {viewItem.createdBy && (
                  <div>
                    <span className="font-medium text-gray-600">Created By:</span>
                    <p className="text-gray-900">{viewItem.createdBy}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <p className="text-gray-900">
                    <StatusBadge status={viewItem.status as 'draft' | 'approved' | 'rejected'} />
                  </p>
                </div>
              </div>
              {viewItem.description && (
                <div>
                  <span className="font-medium text-gray-600">Description:</span>
                  <p className="text-gray-900 mt-1">{viewItem.description}</p>
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 p-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-gray-700">
                  {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
                </p>
                {!canBulkAction && (
                  <p className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                    ⚠️ Select items of the same type for bulk actions
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBulkApproveModal(true)}
                  disabled={!canBulkAction || isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Bulk Approve
                </button>
                <button
                  onClick={() => setShowBulkRejectModal(true)}
                  disabled={!canBulkAction || isProcessing}
                  className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Bulk Reject
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition"
                >
                  Deselect All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Progress Modal */}
        {bulkProgress && (
          <Modal
            isOpen={true}
            title="Processing Bulk Action"
            onClose={() => {}}
            size="md"
          >
            <div className="space-y-4">
              <p className="text-gray-700">{bulkProgress.message}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                {bulkProgress.current} of {bulkProgress.total} completed
              </p>
            </div>
          </Modal>
        )}

        {/* Bulk Approve Modal */}
        <Modal
          isOpen={showBulkApproveModal}
          title="Bulk Approve"
          onClose={() => setShowBulkApproveModal(false)}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to approve {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}?
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowBulkApproveModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBulkApprove(user.id)}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition"
              >
                Approve All
              </button>
            </div>
          </div>
        </Modal>

        {/* Bulk Reject Modal */}
        <RejectionModal
          isOpen={showBulkRejectModal}
          item={{
            _id: 'bulk',
            name: `${selectedItems.length} items`,
            type: selectedItemsType || 'configurations',
          }}
          onConfirm={(rejectedBy, reason) => handleBulkReject(rejectedBy, reason)}
          onCancel={() => setShowBulkRejectModal(false)}
          isLoading={!!bulkProgress}
        />
      </div>
    </div>
  );
}

export default function ApprovalWorkflow() {
  return (
    <UserProvider>
      <ToastProvider>
        <ApprovalWorkflowContent />
      </ToastProvider>
    </UserProvider>
  );
}

