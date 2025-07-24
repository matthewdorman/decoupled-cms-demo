import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-2 p-4 bg-brand-red/5 border border-brand-red/20 rounded-lg text-brand-red ${className}`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
};