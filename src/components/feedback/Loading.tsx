import React from 'react';

export default function Loading({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-8 text-sm text-gray-300">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent mr-2" />
      {label}
    </div>
  );
}
