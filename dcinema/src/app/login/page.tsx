'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import LoginForm from '../../views/LoginForm';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError('');

    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        router.push('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoginForm 
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </div>
  );
}
