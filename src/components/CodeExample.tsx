import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface CodeExampleProps {
  title: string;
  language: string;
  code: string;
  description?: string;
}

export const CodeExample: React.FC<CodeExampleProps> = ({
  title,
  language,
  code,
  description
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      
      {description && (
        <div className="px-4 py-2 bg-blue-50 text-sm text-blue-800 border-b">
          {description}
        </div>
      )}
      
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm bg-gray-900 text-gray-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};