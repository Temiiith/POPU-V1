import React from 'react';

type StatusTagProps = {
  label: string;
  tone?: 'neutral' | 'teal' | 'warning' | 'danger' | 'info';
};

export default function StatusTag({
  label,
  tone = 'neutral',
}: StatusTagProps) {
  const tones = {
    neutral:
      'bg-[var(--popu-muted)] text-[var(--popu-sub)] border-[var(--popu-border)]',

    teal:
      'bg-[var(--popu-muted)] text-[var(--popu-teal)] border-[var(--popu-border)]',

    warning:
      'bg-[var(--popu-muted)] text-[var(--popu-warning)] border-[var(--popu-border)]',

    danger:
      'bg-[var(--popu-muted)] text-[var(--popu-danger)] border-[var(--popu-border)]',

    info:
      'bg-[var(--popu-muted)] text-[var(--popu-teal)] border-[var(--popu-border)]',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-lg border text-[10px] font-bold tracking-wide ${tones[tone]}`}
    >
      {label}
    </span>
  );
}