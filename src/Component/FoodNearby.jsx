import '../styles/FoodNearby.css';
import InfoItem from './InfoItem';

const mockFoodList = [
    {
        name: "명가들깨칼국수 본점",
        desc: "서울특별시 강남구 언주로 12",
        hours: "09:00~22:00",
        rating: 4.2,
        image: "/images/food1.jpg"
    },
    {
        name: "맘스터치",
        desc: "서울시 중구 필동로 24",
        hours: "10:00~21:00",
        rating: 4.1,
        image: "/images/food1.jpg"
    },
    {
        name: "스타벅스 광화문점",
        desc: "서울시 종로구 세종대로 175",
        hours: "08:00~23:00",
        rating: 4.6,
        image: "/images/food1.jpg"
    }
];

export default function FoodNearby () {
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