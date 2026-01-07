interface PicturesProps {
    backgroundImg: string;
}

const Pictures = ({ backgroundImg }: PicturesProps) => {
    return (
        <div
            className="w-[229px] h-32.5 left-[247px] top-0 rounded-[20px]"
            style={{
                backgroundImage: `url(${backgroundImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        />
    );
};

export default Pictures;
