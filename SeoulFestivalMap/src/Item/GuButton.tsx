interface GuButtonProps {
    guName: string;
}

const GuButton = ({ guName }: GuButtonProps) => {
    return(
        <button className="flex flex-col justify-center items-center p-0 gap-px relative w-[93px] min-w-12 h-14 bg-[#E8DEF8] rounded-lg cursor-pointer">
            {guName}
        </button>
    )
}

export default GuButton