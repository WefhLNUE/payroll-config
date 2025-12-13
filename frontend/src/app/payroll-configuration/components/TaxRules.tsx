'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Modal } from './Modal';
import { Form, FormField } from './Form';
import { ListViewContainer, ViewDetailsModal } from './Containers';
import { StatusBadge } from './StatusBadge';
import { apiClient } from '../lib/apiClient';

interface TaxRule {
    _id: string;
    name: string;
    description?: string;
    rate: number;
    status: 'draft' | 'approved' | 'rejected';
}

export default function TaxRules() {
    const [rules, setRules] = useState<TaxRule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [viewItem, setViewItem] = useState<TaxRule | null>(null);
    const [editItem, setEditItem] = useState<TaxRule | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', rate: '' });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        setIsLoading(true);
        const data = await apiClient.get('/payroll-configuration/tax-rule');
        setRules(Array.isArray(data) ? data : []);
        setIsLoading(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            description: formData.description,
            rate: Number(formData.rate),
        };

        if (editItem) {
            await apiClient.patch(`/payroll-configuration/tax-rule/${editItem._id}`, payload);
        } else {
            await apiClient.post('/payroll-configuration/tax-rule', payload);
        }

        setIsFormOpen(false);
        setEditItem(null);
        fetchRules();
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'rate', label: 'Rate (%)' },
        {
            key: 'status',
            label: 'Status',
            render: (v: string, row: TaxRule) => <StatusBadge status={row.status} />,
        },
    ];

    return (
        <>
            <ListViewContainer
                title="Tax Rules"
                data={rules}
                columns={columns}
                onAdd={() => setIsFormOpen(true)}
                onEdit={(i) => {
                    setEditItem(i);
                    setFormData({ name: i.name, description: i.description || '', rate: i.rate.toString() });
                    setIsFormOpen(true);
                }}
                onView={setViewItem}
                isLoading={isLoading}
            />

            <Modal isOpen={isFormOpen} title="Tax Rule" onClose={() => setIsFormOpen(false)}>
                <Form onSubmit={handleSubmit}>
                    <FormField label="Name" name="name" value={formData.name} onChange={handleChange} required />
                    <FormField label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} />
                    <FormField label="Rate (%)" name="rate" type="number" value={formData.rate} onChange={handleChange} required />
                </Form>
            </Modal>

            {viewItem && (
                <ViewDetailsModal
                    item={viewItem}
                    fields={[
                        { key: 'name', label: 'Name' },
                        { key: 'rate', label: 'Rate (%)' },
                        { key: 'status', label: 'Status', render: (v: 'draft' | 'approved' | 'rejected') => <StatusBadge status={v} /> },
                    ]}
                    onClose={() => setViewItem(null)}
                />
            )}
        </>
    );
}
