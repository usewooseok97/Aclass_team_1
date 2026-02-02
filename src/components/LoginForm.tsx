import { useState } from 'react';
import { FilterButton } from '@/atoms/FilterButton';
import { TextLink } from '@/atoms/TextLink';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

export const LoginForm = ({ onSuccess, onSwitchToSignup }: LoginFormProps) => {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(phone, password);
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('로그인에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* 전화번호 */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          전화번호
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01012345678"
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{
            borderColor: 'var(--card-border)',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-primary)',
          }}
          required
        />
      </div>

      {/* 비밀번호 */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{
            borderColor: 'var(--card-border)',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-primary)',
          }}
          required
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* 로그인 버튼 */}
      <FilterButton
        type="submit"
        isActive
        disabled={isLoading}
        className="w-full mt-2"
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </FilterButton>

      {/* 회원가입 링크 */}
      <div className="text-center mt-2">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          계정이 없으신가요?{' '}
        </span>
        <TextLink onClick={onSwitchToSignup}>회원가입</TextLink>
      </div>
    </form>
  );
};
