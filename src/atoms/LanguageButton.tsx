interface LanguageButtonProps {
    onLanguageChange?: (language: string) => void;
}

const LanguageButton = ({ onLanguageChange }: LanguageButtonProps) => {
    const handleClick = () => {
        const newLanguage = 'EN';
        onLanguageChange?.(newLanguage);
    };

    return (
        <button
            onClick={handleClick}
            className="flex flex-row items-center p-0 gap-6 w-35.5 h-8 cursor-pointer bg-transparent border-none"
        >
            <span className="text-sm font-medium">KR</span>
            <span className="text-gray-400">|</span>
            <span className="text-sm font-medium">EN</span>
        </button>
    );
};

export { LanguageButton };
