import { Pictures } from '../atoms/Pictures';
import seoularea from '../assets/seoularea.png';

const GridPictures = () => {
    const images = [seoularea, seoularea, seoularea, seoularea];

    return (
        <div className="grid grid-cols-2 gap-4.5 justify-items-center mt-7.5">
            {images.map((image, index) => (
                <Pictures key={index} backgroundImg={image} />
            ))}
        </div>
    );
};

export { GridPictures };
