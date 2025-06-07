import { useContext } from "react";
import Footer from "../Component/Footer";
import ReviewBoard from "../Component/ReviewBoard";
import { FestivalContext } from "../App";
import MyButton from "../Component/MyButton";
import FestivalInfo from "../Component/FestivalInfo";
import { useParams } from "react-router";

export default function DetailPage() {

    const { festivalData } = useContext(FestivalContext); // 전체 축제 데이터 (계절별 포함)
    const { index } = useParams(); // URL에서 넘겨 받음

    const festival = festivalData?.all?.[parseInt(index)];

    // 유효하지 않은 인덱스 처리
    if (!festival) {
        return (
            <div className="p-6 text-center text-red-500 font-semibold">
                축제 정보를 찾을 수 없습니다.
            </div>
        );
    }

    const images = [festival.MAIN_IMG];
    const reviews = ["재밌어요", "사람이 많아요", "가격이 저렴해요"]; // 기존에 존재하는 리뷰 예시 
    // const restaurants = []; // 먹거리 예시

    return (
        <div className="p-6 space-y-6">
            <MyButton type="back" />

            {/*제목*/}
            <h1 className="text-center text-2xl font-bold bg-purple-200 py-2 rounded">
                {festival.TITLE}
            </h1>

            {/* 대표 이미지 */}
            <div className="relative overflow-hidden rounded-lg">
                <img
                    src={images}
                    alt={festival.TITLE}
                    className="w-full h-auto object-cover"
                />
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

            {/* 리뷰 게시판 */}
            <ReviewBoard initialReviews={reviews} />

            <MyButton type="top" />
            <Footer />
        </div>
    );
}