// components/user/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="text-center my-10">
    <p className="text-red-500 mb-2">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
    >
      Coba Lagi
    </button>
  </div>
);

export default ErrorMessage;