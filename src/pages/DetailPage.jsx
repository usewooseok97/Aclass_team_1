import Footer from "../Component/Footer";
import ReviewBoard from "../Component/ReviewBoard";
import MyButton from "../Component/MyButton";
import FestivalInfo from "../Component/FestivalInfo";
import { useNavigate, useParams } from "react-router";
import { useFestivalUI } from "../Hooks/FestivalHooks";
import { Spinner } from "react-bootstrap";
import FoodNearby from "../Component/FoodNearby";
import FestivalSlider from "../Component/FestivalSlider";
import { foodList } from "../dataset/foodList";
import { imagesList } from "../dataset/imagesList";
import { reviewsList } from "../dataset/reviewsList";

export default function DetailPage() {

    const { festivalData } = useFestivalUI(); // 축제 데이터
    const { title } = useParams(); // URL에서 넘겨 받음
    const titles = decodeURIComponent(title);
    const nav = useNavigate();

    const festival = festivalData?.all?.find(f => f.TITLE === titles);

    // 유효하지 않은 인덱스 처리
    if (!festival) {
        return (
            <div className="p-6 text-center text-red-500 font-semibold">
                <Spinner />
                축제 정보를 찾을 수 없습니다.
            </div>
        );
    }

    const images = [festival.MAIN_IMG, ...imagesList]; // 이미지 예시시
    const reviews = reviewsList // 기존에 존재하는 리뷰 예시 
    const mockFoodList = foodList; // 먹거리 예시시

    // 이미지 클릭 핸들러
    const handleImageClick = () => {
        nav("/gallery", {
            state: {
                title: festival.TITLE,
                images: images
            }
        })
    }


    return (
        <div className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${festival.MAIN_IMG})` }}>
            {/* bg-white/70 숫자변경으로 흐림 조절*/}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-0"></div>
            <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-6 flex flex-col gap-8 ">
                <div className="flex justify-left mt-2">
                    <MyButton type="back" />
                </div>

                {/*제목*/}  {/* 제목이 긴 경우 ...으로 표시 + hover시 두줄로 전체 표시*/}
                <div className="group w-full max-w-[90%] mx-auto text-center overflow-hidden">
                    <h1
                        className={`text-2xl md:text-3xl font-bold text-gray-900 truncate transition-all duration-300 
                                    group-hover:whitespace-normal group-hover:overflow-visible group-hover:text-wrap 
                                    ${festival.TITLE.length > 40
                                        ? "group-hover:text-left group-hover:scale-[1.01] group-hover:tracking-tight"
                                        : ""
                                     }`}
                    >
                        {festival.TITLE}
                    </h1>
                </div>

                {/* 대표 이미지 슬라이더 */}
                <div className="flex flex-col items-start">
                    <FestivalSlider images={images} title={festival.TITLE} onClick={handleImageClick} />
                    <p className="text-xs text-gray-500 italic mt-1 dark:text-gray-400">
                        사진 클릭시 전체사진을 볼 수 있습니다.
                    </p>
                </div>

                {/* 축제 정보 */}
                <FestivalInfo
                    infoItems={[
                        { icon: "🚩", text: festival.PLACE, copy: festival.PLACE },
                        { icon: "⭐", text: "4.5", rating: 4.5 },
                        { icon: "🕒", text: festival.DATE },
                        { icon: "🔗", text: festival.HMPG_ADDR, isLink: true }
                    ]}
                />

                {/* 리뷰 게시판 + 먹거리 병렬로로 */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* 리뷰 게시판 (좌측) */}
                    <div className="lg:w-3/5">
                        <ReviewBoard initialReviews={reviews} />
                    </div>

                    {/* 먹거리 컴포넌트 (우측) */}
                    <div className="lg:w-2/5 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                        <FoodNearby mockFoodList={mockFoodList} />
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <MyButton type="top" />
                </div>
                <Footer />

            </div>
        </div>
    );
}