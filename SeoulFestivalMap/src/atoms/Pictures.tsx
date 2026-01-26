interface PicturesProps {
    backgroundImg: string;
    alt?: string;
}

const Pictures = ({ backgroundImg, alt = "축제 이미지" }: PicturesProps) => {
    return (
        <img
            src={backgroundImg}
            alt={alt}
            className="w-[229px] h-32.5 rounded-[20px] object-cover"
            loading="lazy"
        />
    );
};

export { Pictures };
