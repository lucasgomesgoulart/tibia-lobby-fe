import React from 'react';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Algo deu errado.', onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <p className="text-red-500 text-sm mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700 transition"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
