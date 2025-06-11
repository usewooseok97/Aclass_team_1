import { useEffect, useRef, useState } from "react";
import MyButton from "../Component/MyButton";
import Footer from "../Component/Footer";
import { useLocation } from "react-router";

export default function GalleryPage() {
    // location에서 state 받아오기
    const location = useLocation();
    const { title = "갤러리", images = [] } = location.state || {};

    // 이미지가 배열이 아니어서 map에러가 나는 것을 방지하기 위한 안전장치
    const safeImages = Array.isArray(images) ? images : [];

    const [visibleCount, setVisibleCount] = useState(2); // 렌더링시 보여줄 이미지 수 지정 (~무한증가가)
    const loaderRef = useRef(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [currentImg, setCurrentImg] = useState(null);

    const handleOpenModal = (imgUrl) => { // 모달 열기 핸들러 (현재 이미지 저장 + 모달 true)
        setCurrentImg(imgUrl);
        setModalOpen(true);
    };

    const handleCloseModal = () => {      // 모달 닫기 핸들러 (이미지 + 이미지 외부 div태그 영역 클릭시 종료)
        setModalOpen(false);
        setCurrentImg(null);
    };

    // ▶ 무한 스크롤 IntersectionObserver 나중에 사진 수가 많아져도 문제없이 구현가능, 초기 렌더링 빠르게해줌
    useEffect(() => {
        const observer = new IntersectionObserver( // 특정 dom요소가 화면에 보이는지 감지하는 브라우저 기능능
            ([entry]) => {
                // loader가 화면에 보이고 && 아직 이미지가 남아 있으면 2장씩 추가 로드
                if (entry.isIntersecting && visibleCount < safeImages.length) {
                    setVisibleCount((prev) => prev + 2);
                }
            },
            {
                threshold: 1.0, // 100% 보일때만 감지
            }
        );

        // loader(현재 감시 대상)
        const currentLoader = loaderRef.current;
        // 감시 시작
        if (currentLoader) observer.observe(currentLoader);

        // 언마운트 시 옵저버 해제 (클린업 함수)
        return () => currentLoader && observer.unobserve(currentLoader);
    }, [visibleCount, safeImages.length]);

    return (
        <div className="min-h-screen bg-gray-900 text-white relative">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

            <div className="relative z-10 max-w-[1200px] mx-auto py-10 px-4 flex flex-col gap-8">
                <div className="flex justify-start">
                    <MyButton type="back" currentSeason="null"/>
                </div>

                <h1 className="text-center text-3xl font-bold text-white bg-gradient-to-r from-pink-500 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
                    {title}
                </h1>

                {/* 썸네일 갤러리 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 place-items-center">
                    {safeImages.slice(0, visibleCount).map((img, idx) => (
                        <div
                            key={idx}
                            className="w-[400px] h-[500px] rounded-lg overflow-hidden cursor-pointer shadow-lg hover:scale-[1.02] transition"
                            onClick={() => handleOpenModal(img)}
                        >
                            <img
                                src={img}
                                alt={`gallery-${idx}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

                {/* 로딩 트리거 (보이면 다음 로드) */}
                <div
                    ref={loaderRef}
                    className="h-10 mt-6 flex justify-center items-center text-sm opacity-70"
                >
                    {visibleCount < safeImages.length ? "로딩 중..." : "모든 이미지를 불러왔습니다."}
                </div>

                {/* TOP 버튼 */}
                <div className="flex justify-center mt-6">
                    <MyButton type="top" currentSeason="null"/>
                </div>

                <Footer />
            </div>

            {/* 모달 부분 */}
            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
                    onClick={handleCloseModal}
                >
                    <img
                        src={currentImg}
                        alt="expanded"
                        className="max-w-[90%] max-h-[90%] rounded shadow-2xl border-4 border-white"
                    />
                </div>
            )}
        </div>
    );
}