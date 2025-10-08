'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import RegisterForm from '../../views/RegisterForm';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError('');

    try {
      const result = await register(data.name, data.email, data.password);
      
      if (result.success) {
        router.push('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <RegisterForm 
        onSubmit={handleRegister}
        loading={loading}
        error={error}
      />
    </div>
  );
}
