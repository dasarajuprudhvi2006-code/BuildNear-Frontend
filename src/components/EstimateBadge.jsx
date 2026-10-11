import React from 'react';
import { Info } from 'lucide-react';

export default function EstimateBadge({ text = 'Starting Estimate', size = 'sm' }) {
  return (
    <span
      className={`badge badge-amber ${size === 'xs' ? 'text-xs' : 'text-sm'}`}
      title="Transparent estimate: Actual quotes may vary based on site survey and material selection."
      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
    >
      <Info size={12} />
      <span>{text}</span>
    </span>
  );
}
