import { useContext } from 'react';
import { FestivalContext } from '../App';
import seoulMapData from '../dataset/seoulMapData';

export default function FestivalList() {
  const { festivalData, isLoading, currentSeason, setCurrentSeason, selectedDistrict, setSelectedDistrict } = useContext(FestivalContext);

  if (isLoading) return <p>로딩 중...</p>;

  const filteredFestivals = festivalData.bySeason[currentSeason]?.filter(item =>
    selectedDistrict === '' || item.GUNAME === selectedDistrict
  ); // 현재 계절에서 선택된 자치구가 있다면 필터링하고 아니면 전체 데이터 출력

  return (
    <>
      {/* ✅ 계절 버튼 */}
      <div className="mb-3">
        <strong>계절 선택:</strong><br />
        {['봄', '여름', '가을', '겨울'].map(season => (
          <button
            key={season}
            className={`btn btn-${season === currentSeason ? 'primary' : 'outline-primary'} me-2 my-1`}
            onClick={() => setCurrentSeason(season)}
          >
            {season}
          </button>
        ))}
      </div>

      {/* ✅ 구 이름 버튼 */}
      <div className="mb-4">
        <strong>지역 선택:</strong><br />
        {seoulMapData.areas.map((area) => (
          <button
            key={area.id}
            className={`btn btn-${selectedDistrict === area.name ? 'success' : 'outline-success'} me-2 my-1`}
            onClick={() => setSelectedDistrict(area.name)}
          >
            {area.name}
          </button>
        ))}
        <button
          className={`btn btn-${selectedDistrict === '' ? 'secondary' : 'outline-secondary'} ms-2 my-1`}
          onClick={() => setSelectedDistrict('')}
        >
          전체 보기
        </button>
      </div>

      {/* ✅ 축제 리스트 출력 */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredFestivals.map((item, idx) => (
          <div className="col" key={idx}>
            <div className="card h-100">
              <img src={item.MAIN_IMG} className="card-img-top" alt={item.TITLE} />
              <div className="card-body">
                <h5 className="card-title">{item.TITLE}</h5>
                <p>{item.GUNAME} | {item.PLACE}</p>
                <a href={item.HMPG_ADDR} className="btn btn-sm btn-outline-secondary" target="_blank" rel="noopener noreferrer">
                  자세히 보기
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
