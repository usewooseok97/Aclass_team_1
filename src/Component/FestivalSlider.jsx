import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FestivalSlider({ images = [], title = "" }) {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((current - 1 + images.length) % images.length);
    const next = () => setCurrent((current + 1) % images.length);

    return (
        <div className="relative w-full h-[360px] sm:h-[300px] overflow-hidden rounded-xl bg-gray-100">
            {/* 배경 흐림 처리 */}
            <div
                className="absolute inset-0 bg-cover blur-sm scale-110 z-0"
                style={{
                    backgroundImage: `url(${images[current]})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />

            {/* 메인 이미지 (잘리지 않게게) */}
            <img
                src={images[current]}
                alt={`festival-${current}`}
                className="relative z-10 w-full h-full object-contain"
            />

            {/* 🔼 왼쪽 화살표 */}
            <button
                onClick={prev}
                className="absolute top-1/2 left-2 -translate-y-1/2 z-20 bg-white/50 hover:bg-white/70 transition p-2 rounded-full shadow-md"
            >
                <ChevronLeft size={28} />
            </button>

            {/* 🔼 오른쪽 화살표 */}
            <button
                onClick={next}
                className="absolute top-1/2 right-2 -translate-y-1/2 z-20 bg-white/50 hover:bg-white/70 transition p-2 rounded-full shadow-md"
            >
                <ChevronRight size={28} />
            </button>
        </div>
    );
}
