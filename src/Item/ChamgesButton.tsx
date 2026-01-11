interface ChamgesButtonProps {
    onLanguageChange?: (language: string) => void;
}

const ChamgesButton = ({ onLanguageChange }: ChamgesButtonProps) => {
    const handleClick = () => {
        const newLanguage = 'EN'; // 나중에 toggle 로직으로 변경 예정
        console.log(`언어 변경: ${newLanguage}`);

        if (onLanguageChange) {
            onLanguageChange(newLanguage);
        }
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

export default ChamgesButton;
