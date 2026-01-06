import GuButton from '../Item/GuButton';
import seoulMapData from '../Constants/guData';

const GridButtonContainer = () => {
    return (
        <div className="w-full grid grid-cols-5 grid-rows-5 gap-2 p-1 justify-items-center">
            {seoulMapData.areas.map((district) => (
                <GuButton key={district.id} guName={district.name} />
            ))}
        </div>
    );
};

export default GridButtonContainer;
