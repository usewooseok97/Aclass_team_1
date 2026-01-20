interface TitleTextProps {
    text: string;
}

const FooterText = ({ text }: TitleTextProps) => {
    return (
        <div
            className="h-8 flex items-center font-semibold text-[14px] font-['Roboto']"
            style={{ color: 'var(--text-primary)' }}
        >
            {text}
        </div>
    );
};

export { FooterText };
