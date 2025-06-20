// 계절 구분 함수
export const getSeason = (month) => {
  if ([3, 4, 5].includes(month)) return '봄';
  if ([6, 7, 8].includes(month)) return '여름';
  if ([9, 10, 11].includes(month)) return '가을';
  return '겨울';
};

// 데이터를 간단화하고 평점, 계절 추가
export const simplifyAndSortFestivalData = (rawData) => {
  const bySeason = { 봄: [], 여름: [], 가을: [], 겨울: [] };
  const all = [];

  rawData.forEach((item) => {
    const startMonth = parseInt(item.STRTDATE.slice(5, 7));
    const season = getSeason(startMonth);
    const randomRating = Math.floor(Math.random() * 5) * 0.5 + 3;

    const simplified = {
      season,
      GUNAME: item.GUNAME,
      TITLE: item.TITLE,
      DATE: item.DATE,
      PLACE: item.PLACE,
      ORG_NAME: item.ORG_NAME,
      USE_TRGT: item.USE_TRGT,
      MAIN_IMG: item.MAIN_IMG,
      IS_FREE: item.IS_FREE,
      HMPG_ADDR: item.HMPG_ADDR,
      PROGRAM: item.PROGRAM,
      rating: randomRating,
    };

    all.push(simplified);
    bySeason[season].push(simplified);
  });

  return { all, bySeason };
};

// 시즌별로 컬러 설정
export  const getSeasonColor = (season) => {
      switch (season) {
          case '봄': return 'rgba(246,167,249,0.25)';
          case '여름': return 'rgba(96,201,57,0.25)';
          case '가을': return 'rgba(239,142,0,0.25)';
          case '겨울': return 'rgba(229, 231, 235, 0.25)';
          default: return '#D1D5DB';
      }
  };


//페이지 번호 관련 함수
export function generatePageNumbers(currentPage, totalPages, maxVisible = 5) {
  const pageNumbers = [];
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  return pageNumbers;
}

// ✅ 상위 3개 구 계산 함수
export function calculateTopDistricts(festivalData, currentSeason) {
  if (!festivalData.bySeason || !currentSeason) return [];

  const currentSeasonFestivals = festivalData.bySeason[currentSeason];

  const ratingMap = {};
  currentSeasonFestivals.forEach(f => {
    if (!f.rating) return;
    if (!ratingMap[f.GUNAME]) ratingMap[f.GUNAME] = { total: 0, count: 0 };
    ratingMap[f.GUNAME].total += f.rating;
    ratingMap[f.GUNAME].count += 1;
  });

  const avgArray = Object.entries(ratingMap).map(([gu, data]) => ({
    gu,
    avg: data.total / data.count,
  }));

  const top3 = avgArray.sort((a, b) => b.avg - a.avg).slice(0, 3);
  return top3.map(d => d.gu);
}
