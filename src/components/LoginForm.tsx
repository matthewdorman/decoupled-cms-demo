import React, { useState } from 'react';
import { LogIn, User, Lock, X } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  onCancel: () => void;
  isOpen: boolean;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onCancel,
  isOpen,
  loading = false
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await onLogin(username, password);
      if (success) {
        setUsername('');
        setPassword('');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-teal/10 rounded-lg">
                <LogIn className="w-5 h-5 text-brand-teal" />
              </div>
              <h2 className="text-xl font-bold text-brand-navy">
                Login to Drupal
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="p-1 hover:bg-brand-light-gray rounded"
            >
              <X className="w-4 h-4 text-brand-text-gray" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-brand-navy mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-gray" />
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-brand-navy mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-gray" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-brand-red/5 border border-brand-red/20 rounded-lg text-brand-red text-sm">
                  {error}
                </div>
              )}

              {/* Info */}
              <div className="p-3 bg-brand-teal/5 rounded-lg text-xs text-brand-text-gray">
                <p><strong>Note:</strong> This will authenticate with your local Drupal site at drupalsite.ddev.site</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-brand-text-gray hover:text-brand-navy transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !username.trim() || !password.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};