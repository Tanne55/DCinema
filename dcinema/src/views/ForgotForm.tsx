"use client";
import React, { useState } from 'react';

interface Props {
  onSubmit: (data: { email: string; newPassword: string }) => void;
  loading?: boolean;
  error?: string | null;
}

export default function ForgotForm({ onSubmit, loading = false, error = null }: Props) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, newPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="mt-1 block w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">New password</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          minLength={6}
          className="mt-1 block w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'Processing...' : 'Reset password'}
        </button>
      </div>
    </form>
  );
}
