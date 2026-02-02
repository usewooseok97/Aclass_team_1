import { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { FilterButton } from '@/atoms/FilterButton';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';

export const AuthButton = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  if (isLoading) {
    return (
      <div className="w-20 h-9 bg-gray-200 rounded-lg animate-pulse" />
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="relative">
        <FilterButton
          onClick={() => setShowDropdown(!showDropdown)}
          className="gap-1"
        >
          <User className="w-4 h-4" />
          <span className="max-w-20 truncate">{user.nickname}</span>
        </FilterButton>

        {/* 드롭다운 메뉴 */}
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <div
              className="absolute right-0 top-full mt-2 w-40 rounded-lg shadow-lg z-50 py-1"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                borderWidth: '1px',
              }}
            >
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <FilterButton onClick={() => setIsModalOpen(true)}>
        <User className="w-4 h-4" />
        로그인
      </FilterButton>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
