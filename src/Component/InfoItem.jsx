import { useCallback } from "react";
import { RatingStars } from "./RatingStars";

export default function InfoItem({ icon, text, isLink, rating, copy }) {

  // 부모 컴포넌트가 리렌더링 되어도 copy가 바뀌지 않으면 copyToClipboard 함수 객체 생성X 
  // (함수 재생성 방지)
  const copyToClipboard = useCallback(() => {
    if (!copy) return;
    navigator.clipboard.writeText(copy)
      .then(() => alert(`복사되었습니다!`))
      .catch(() => alert('복사에 실패했습니다.'));
  }, [copy]);

  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <div className="flex items-center gap-1">
        <span>{icon}</span>   {/*icon 보이기*/}
        {isLink ? (           // isLink가 있다면 text 보이고 클릭시 링크되게 설정
          <a href={text}
            className="text-blue-600 underline hover:text-blue-800 break-words break-all whitespace-pre-wrap max-w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            {new URL(text).hostname}
          </a> // url 너무 길어서 도메인만 보여지도록 설정
        ) : rating ? (        // isLink가 없고 rating가 있다면 text 보이고 별점 보이게 설정
          <>
            <span>({text})</span>
            <RatingStars rating={rating} />
          </>
        ) : (
          <span>{text}</span> // isLink, rating 둘다 없다면 text만 보이게 설정
        )}

        {/* copy prop이 있으면 복사 아이콘 보여주기 */}
        {copy && (
          <span
            onClick={copyToClipboard}
            style={{ cursor: "pointer", userSelect: "none", marginLeft: 6 }}
            title="복사하기"
          >
            📋
          </span>
        )}
      </div>
    </div>
  );
};