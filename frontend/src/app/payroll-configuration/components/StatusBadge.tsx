'use client';

interface StatusBadgeProps {
  status: 'draft' | 'approved' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const baseStyles = 'font-semibold rounded-full';

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  } as const;

  const statusStyles = {
    draft: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  } as const;

  const statusLabels = {
    draft: 'Draft',
    approved: 'Approved',
    rejected: 'Rejected',
  } as const;

  const typedStatus = status as 'draft' | 'approved' | 'rejected';

  return (
    <span className={`${baseStyles} ${sizeStyles[size as 'sm' | 'md' | 'lg']} ${statusStyles[typedStatus]}`}>
      {statusLabels[typedStatus]}
    </span>
  );
}
