interface TitleTextProps {
    text: string;
}

const TitleText = ({ text }: TitleTextProps) => {
    return (
        <div className="w-[259px] h-8 flex mt-12.5 items-center text-black font-semibold text-[28px] font-['Roboto']">
            {text}
        </div>
    );
};

export default TitleText;
