interface ContentsTextProps {
    text: string;
    className : string;
}

const ContentsText = ({ text , className }: ContentsTextProps) => {
    return (
        <div className={`w-[495px]flex items-center leading-8 text-black font-semibold text-[24px] font-['Roboto'] whitespace-pre-line ${className}`}>
            {text}
        </div>
    );
};

export default ContentsText;
