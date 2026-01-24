interface TitleTextProps {
    text: string;
}

const TitleText = ({ text }: TitleTextProps) => {
    return (
        <p
            className="w-full h-8 text-center font-semibold text-[28px] font-['Roboto']"
            style={{ color: 'var(--text-primary)' }}
        >
            {text}
        </p>
    );
};

export { TitleText };
