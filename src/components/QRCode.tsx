import React from 'react';
import { Smartphone, ExternalLink, Github } from 'lucide-react';

interface QRCodeProps {
  url: string;
  title?: string;
  className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({ 
  url, 
  title = "Scan to Access Demo", 
  className = "" 
}) => {
  // Generate QR code using QR Server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  // Determine if this is a GitHub URL
  const isGitHub = url.includes('github.com');
  const IconComponent = isGitHub ? Github : Smartphone;
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 text-center ${className}`}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <IconComponent className="w-5 h-5 text-brand-red" />
        <h3 className="text-lg font-semibold text-brand-navy">{title}</h3>
      </div>
      
      <div className="mb-4">
        <img 
          src={qrCodeUrl} 
          alt={`QR code for ${url}`}
          className="mx-auto rounded-lg shadow-sm"
          width={200}
          height={200}
        />
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-brand-text-gray">
          {isGitHub ? 'Scan to view the source code' : 'Scan with your phone to access the demo'}
        </p>
        <div className="flex items-center justify-center gap-1 text-xs text-brand-text-gray/70">
          <ExternalLink className="w-3 h-3" />
          <span className="font-mono break-all">{url}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy/90 transition-colors text-sm font-medium"
        >
          {isGitHub ? (
            <>
              <Github className="w-4 h-4" />
              View on GitHub
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4" />
              Open Demo Site
            </>
          )}
        </a>
      </div>
    </div>
  );
};