import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordProtectionProps {
  onPasswordChange: (password: string | undefined) => void;
}

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({ onPasswordChange }) => {
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsProtected(checked);
    if (!checked) {
      setPassword('');
      onPasswordChange(undefined);
    } else {
        onPasswordChange(password);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if(isProtected) {
      onPasswordChange(newPassword);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="password-protect"
          checked={isProtected}
          onChange={handleCheckboxChange}
          className="h-4 w-4 rounded border-gray-300 dark:border-gray-500 text-primary-600 focus:ring-primary-500 dark:bg-slate-600 dark:focus:ring-offset-slate-800"
        />
        <label htmlFor="password-protect" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Protect with Password
        </label>
      </div>
      {isProtected && (
        <div className="mt-4 relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            className="w-full p-3 pl-10 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200 focus:ring-primary-500 focus:border-primary-500"
            aria-label="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      )}
    </div>
  );
};
