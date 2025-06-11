import { ArrowUp, ArrowLeft } from "lucide-react";

export default function Button({ type, clickEvent, currentSeason = { currentSeason } }) {
    const handleClick = () => {
        if (type === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (type === "back") {
            window.history.back();
        }
        else if (type === "behind") {
            clickEvent()
        }
    };

    // 시즌별로 컬러 설정
    const getSeasonColor = (season) => {
        switch (season) {
            case '봄': return 'rgba(246,167,249,0.25)';
            case '여름': return 'rgba(96,201,57,0.25)';
            case '가을': return 'rgba(239,142,0,0.25)';
            case '겨울': return 'rgba(229, 231, 235, 0.25)';
            default: return '#D1D5DB';
        }
    };

    const seasonColor = getSeasonColor(currentSeason);

    return (
        <button
            onClick={handleClick}
            className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center gap-1 text-sm"
            style={{ backgroundColor: seasonColor }}
        >
            {type === "top" ? <ArrowUp size={16} /> : <ArrowLeft size={16} />}
        </button>
    );
};