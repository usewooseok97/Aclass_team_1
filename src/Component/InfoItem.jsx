import { useCallback } from "react";
import { RatingStars } from "./RatingStars";

export default function InfoItem({ icon, text, isLink, rating, copy }) {

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
          <a href={text} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
            {text}
          </a>
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