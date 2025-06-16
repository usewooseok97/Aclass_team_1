import { ArrowUp, ArrowLeft } from "lucide-react";
import { getSeasonColor } from "../utilFunction/festivalUtils";

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