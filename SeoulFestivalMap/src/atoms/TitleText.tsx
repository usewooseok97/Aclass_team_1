interface TitleTextProps {
    text: string;
}

const TitleText = ({ text }: TitleTextProps) => {
    return (
        <p
            className="w-full h-8 mt-12.5 text-center font-semibold text-[28px] font-['Roboto']"
            style={{ color: 'var(--text-primary)' }}
        >
            {text}
        </p>
    );
};

export { TitleText };
