interface GuButtonProps {
    guName: string;
}

const GuButton = ({ guName }: GuButtonProps) => {
    return(
        <button className="flex flex-col justify-center items-center p-0 gap-[2px] relative w-full max-w-[93px] min-w-[48px] h-14 bg-[#E8DEF8] rounded-lg border-none cursor-pointer text-xs">
            {guName}
        </button>
    )
}

export default GuButton