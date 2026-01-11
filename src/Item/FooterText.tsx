interface TitleTextProps {
    text: string;
}

const FooterText = ({ text }: TitleTextProps) => {
    return (
        <div className="h-8 flex items-center text-black font-semibold text-[14px] font-['Roboto']">
            {text}
        </div>
    );
};

export default FooterText;
