'use client';

import { useState, useEffect } from 'react';
import { ListViewContainer, ViewDetailsModal } from './Containers';
import { StatusBadge } from './StatusBadge';
import { apiClient } from '../lib/apiClient';

interface InsuranceBracket {
    _id: string;
    name: string;
    minSalary: number;
    maxSalary: number;
    employeeRate: number;
    employerRate: number;
    status: 'draft' | 'approved' | 'rejected';
}

export default function InsuranceBrackets() {
    const [data, setData] = useState<InsuranceBracket[]>([]);
    const [viewItem, setViewItem] = useState<InsuranceBracket | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        const res = await apiClient.get('/payroll-configuration/insurance-brackets');
        setData(Array.isArray(res) ? res : []);
        setIsLoading(false);
    };

    const approve = async (id: string, status: 'approved' | 'rejected') => {
        await apiClient.patch(`/payroll-configuration/insurance-brackets/${id}/status`, { status });
        fetchData();
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'minSalary', label: 'Min Salary' },
        { key: 'maxSalary', label: 'Max Salary' },
        {
            key: 'status',
            label: 'Status',
            render: (v: string, row: InsuranceBracket) => (
                <div className="flex gap-2 items-center">
                    <StatusBadge status={v as any} />
                    {v === 'draft' && (
                        <>
                            <button onClick={() => approve(row._id, 'approved')} className="text-green-600 text-sm">
                                Approve
                            </button>
                            <button onClick={() => approve(row._id, 'rejected')} className="text-red-600 text-sm">
                                Reject
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <ListViewContainer
                title="Insurance Brackets (HR Approval)"
                data={data}
                columns={columns}
                onAdd={() => { }}
                onView={setViewItem}
                isLoading={isLoading}
            />

            {viewItem && (
                <ViewDetailsModal
                    item={viewItem}
                    fields={[
                        { key: 'name', label: 'Name' },
                        { key: 'minSalary', label: 'Min Salary' },
                        { key: 'maxSalary', label: 'Max Salary' },
                        { key: 'employeeRate', label: 'Employee Rate (%)' },
                        { key: 'employerRate', label: 'Employer Rate (%)' },
                        { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
                    ]}
                    onClose={() => setViewItem(null)}
                />
            )}
        </>
    );
}
