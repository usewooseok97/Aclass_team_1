import Footer from "../Component/Footer";
import ReviewBoard from "../Component/ReviewBoard";
import MyButton from "../Component/MyButton";
import FestivalInfo from "../Component/FestivalInfo";
import { useParams } from "react-router";
import { useFestivalUI } from "../Hooks/FestivalHooks";
import { Spinner } from "react-bootstrap";
import FoodNearby from "../Component/FoodNearby";
import FestivalSlider from "../Component/FestivalSlider";
import { foodList } from "../dataset/foodList";
import { imagesList } from "../dataset/imagesList";

export default function DetailPage() {

    const { festivalData } = useFestivalUI(); // 축제 데이터
    const { title } = useParams(); // URL에서 넘겨 받음
    const titles = decodeURIComponent(title);

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

    const images = [festival.MAIN_IMG, ...imagesList];
    const reviews = ["재밌어요", "사람이 많아요", "가격이 저렴해요", "가족과 함께 오면 더 좋을 것 같아요~", "다음에 또 오고 싶어요!!!"]; // 기존에 존재하는 리뷰 예시 
    const mockFoodList = foodList;

    return (
        <div className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${festival.MAIN_IMG})` }}>
            {/* bg-white/70 숫자변경으로 흐림 조절*/}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-0"></div>
            <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-6 flex flex-col gap-8 ">
                <div className="flex justify-left mt-2">
                    <MyButton type="back" />
                </div>

                {/*제목*/}
                <h1 className="text-center text-2xl font-bold bg-purple-200 py-3 rounded ">
                    {festival.TITLE}
                </h1>

                {/* 대표 이미지 슬라이더 */}
                <FestivalSlider images={images} title={festival.TITLE} />

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
                    <div className="lg:w-2/3">
                        <ReviewBoard initialReviews={reviews} />
                    </div>

                    {/* 먹거리 컴포넌트 (우측) */}
                    <div className="lg:w-1/3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                        <FoodNearby mockFoodList={mockFoodList}/>
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