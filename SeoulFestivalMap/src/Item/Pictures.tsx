interface PicturesProps {
    backgroundImg: string;
}

const Pictures = ({ backgroundImg }: PicturesProps) => {
    return (
        <div
            className="w-[229px] h-32.5 rounded-[20px] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImg})` }}
        />
    );
};

export default Pictures;
