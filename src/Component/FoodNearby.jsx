import '../styles/FoodNearby.css';
import InfoItem from './InfoItem';

export default function FoodNearby ({mockFoodList}) {
    return (
        <div className="food-wrapper">
            <h2 className="food-title">주변 먹거리</h2>
            <div className="food-list">
                {mockFoodList.map((food, idx) => (
                    <div className="food-card" key={idx}>
                        <img src={food.image} alt={food.name} />
                        <div className="food-info">
                            <h3>{food.name}</h3>
                            <InfoItem icon="📍" text={food.desc} />
                            <InfoItem icon="⭐" text={food.rating} rating={food.rating} />
                            <InfoItem icon="🕒" text={food.hours} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};