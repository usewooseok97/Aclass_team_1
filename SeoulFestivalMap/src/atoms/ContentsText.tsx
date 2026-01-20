interface ContentsTextProps {
    text: string;
    className : string;
}

const ContentsText = ({ text , className }: ContentsTextProps) => {
    return (
        <div
            className={`w-[495px]flex items-center leading-8 font-semibold text-[24px] font-['Roboto'] whitespace-pre-line ${className}`}
            style={{ color: 'var(--text-primary)' }}
        >
            {text}
        </div>
    );
};

export { ContentsText };
