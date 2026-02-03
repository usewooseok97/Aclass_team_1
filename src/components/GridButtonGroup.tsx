import { GuButtonContainer } from '@/containers/GuButtonContainer';
import seoulMapData, { type SeoulDistrict } from '@/constants/guData';

const GridButtonGroup = () => {
    return (
        <div className="grid grid-cols-5 gap-4 p-1 justify-items-center">
            {seoulMapData.areas.map((district: SeoulDistrict) => (
                <GuButtonContainer key={district.id} guName={district.name} />
            ))}
        </div>
    );
};

export { GridButtonGroup };
