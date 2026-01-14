interface TitleTextProps {
    text: string;
}

const TitleText = ({ text }: TitleTextProps) => {
    return (
        <p className="w-full h-8 mt-12.5 text-center text-black font-semibold text-[28px] font-['Roboto']">
            {text}
        </p>
    );
};

export { TitleText };
