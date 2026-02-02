import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'signup';

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleSuccess = () => {
    onClose();
    setMode('login');
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* 모달 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div
              className="relative rounded-2xl shadow-xl p-6"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                borderWidth: '1px',
              }}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>

              {/* 제목 */}
              <h2
                className="text-xl font-bold mb-6 text-center"
                style={{ color: 'var(--text-primary)' }}
              >
                {mode === 'login' ? '로그인' : '회원가입'}
              </h2>

              {/* 폼 */}
              {mode === 'login' ? (
                <LoginForm
                  onSuccess={handleSuccess}
                  onSwitchToSignup={() => handleSwitchMode('signup')}
                />
              ) : (
                <SignupForm
                  onSuccess={handleSuccess}
                  onSwitchToLogin={() => handleSwitchMode('login')}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
