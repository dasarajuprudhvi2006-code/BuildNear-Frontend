import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({
  rating = 0,
  maxStars = 5,
  size = 16,
  showNumber = true,
  count = null,
  interactive = false,
  onChange = () => {},
}) {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    const isFilled = i <= Math.round(rating);
    stars.push(
      <span
        key={i}
        onClick={() => interactive && onChange(i)}
        style={{
          cursor: interactive ? 'pointer' : 'default',
          display: 'inline-flex',
          transition: 'transform 0.1s ease',
        }}
        onMouseEnter={(e) => interactive && (e.currentTarget.style.transform = 'scale(1.2)')}
        onMouseLeave={(e) => interactive && (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Star
          size={size}
          fill={isFilled ? '#f59e0b' : 'none'}
          color={isFilled ? '#f59e0b' : '#cbd5e1'}
          strokeWidth={1.75}
        />
      </span>
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'inline-flex', gap: '2px' }}>{stars}</div>
      {showNumber && rating > 0 && (
        <span style={{ fontWeight: 600, fontSize: `${size}px`, marginLeft: '2px', color: '#0f172a' }}>
          {rating.toFixed(1)}
        </span>
      )}
      {count !== null && (
        <span style={{ fontSize: `${Math.max(12, size - 2)}px`, color: '#64748b' }}>
          ({count} reviews)
        </span>
      )}
    </div>
  );
}
