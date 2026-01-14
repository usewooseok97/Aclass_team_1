interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "데이터를 불러오는 중..." }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
}

const ErrorState = ({ title = "데이터 로드 실패", message }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <svg
        className="w-20 h-20 text-red-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-red-600 text-center font-semibold mb-2">{title}</p>
      {message && <p className="text-gray-600 text-center text-sm">{message}</p>}
    </div>
  );
};

export { LoadingState, ErrorState };
