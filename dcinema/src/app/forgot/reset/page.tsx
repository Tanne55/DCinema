"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // read email from window location on client
    try {
      const params = new URLSearchParams(window.location.search);
      const e = params.get('email') || '';
      if (!e) {
        router.push('/forgot');
      } else {
        setEmail(e);
      }
    } catch (err) {
      router.push('/forgot');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, newPassword: password }) });
      const json = await res.json();
      if (json.success) {
        setMessage('Mật khẩu đã được cập nhật. Bạn sẽ được chuyển tới trang đăng nhập.');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setError(json.message || 'Không thể cập nhật mật khẩu');
      }
    } catch (err) {
      setError('Lỗi mạng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Đặt mật khẩu mới</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Cho email: <strong>{email}</strong></p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">Mật khẩu mới</label>
              <input id="password" name="password" type="password" required minLength={6}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Mật khẩu mới" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
            </div>
            <div>
              <label htmlFor="confirm" className="sr-only">Xác nhận mật khẩu</label>
              <input id="confirm" name="confirm" type="password" required minLength={6}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Xác nhận mật khẩu" value={confirm} onChange={e => setConfirm(e.target.value)} disabled={loading} />
            </div>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{message}</div>}

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
