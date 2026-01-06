import GuButton from '../Item/GuButton';
import seoulMapData from '../Constants/guData';

const GridButtonContainer = () => {
    return (
        <div className="grid grid-cols-5 gap-4 p-1 justify-items-center">
            {seoulMapData.areas.map((district) => (
                <GuButton key={district.id} guName={district.name} />
            ))}
        </div>
    );
};

export default GridButtonContainer;
