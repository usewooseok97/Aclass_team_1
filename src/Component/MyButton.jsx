import { ArrowUp, ArrowLeft } from "lucide-react";

export default function Button({ type }) {
    const handleClick = () => {
        if (type === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (type === "back") {
            window.history.back();
        }
    };

    return (
        <button
            onClick={handleClick}
            className="px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center gap-1 text-sm"
        >
            {type === "top" ? <ArrowUp size={16} /> : <ArrowLeft size={16} />}
            {type === "top" ? "🔝" : "⬅️"}
        </button>
    );
};