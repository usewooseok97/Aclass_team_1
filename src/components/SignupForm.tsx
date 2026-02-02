import { useState } from 'react';
import { FilterButton } from '@/atoms/FilterButton';
import { TextLink } from '@/atoms/TextLink';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const SignupForm = ({ onSuccess, onSwitchToLogin }: SignupFormProps) => {
  const { signup } = useAuth();
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 클라이언트 유효성 검사
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(nickname, phone, password, passwordConfirm);
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('회원가입에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* 닉네임 */}
      <div>
        <label
          htmlFor="nickname"
          className="block text-sm font-medium mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 (2~20자)"
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{
            borderColor: 'var(--card-border)',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-primary)',
          }}
          required
          minLength={2}
          maxLength={20}
        />
      </div>

      {/* 전화번호 */}
      <div>
        <label
          htmlFor="signup-phone"
          className="block text-sm font-medium mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          전화번호
        </label>
        <input
          id="signup-phone"
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
          htmlFor="signup-password"
          className="block text-sm font-medium mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          비밀번호
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 (6자 이상)"
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{
            borderColor: 'var(--card-border)',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-primary)',
          }}
          required
          minLength={6}
        />
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <label
          htmlFor="password-confirm"
          className="block text-sm font-medium mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          비밀번호 확인
        </label>
        <input
          id="password-confirm"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호 확인"
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

      {/* 가입 버튼 */}
      <FilterButton
        type="submit"
        isActive
        disabled={isLoading}
        className="w-full mt-2"
      >
        {isLoading ? '가입 중...' : '회원가입'}
      </FilterButton>

      {/* 로그인 링크 */}
      <div className="text-center mt-2">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          이미 계정이 있으신가요?{' '}
        </span>
        <TextLink onClick={onSwitchToLogin}>로그인</TextLink>
      </div>
    </form>
  );
};
