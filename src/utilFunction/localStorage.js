// ✅ 로컬스토리지에 찜 추가
const saveFavorite = (title) => {
  localStorage.setItem(title, title);
};

// ✅ 로컬스토리지에서 찜 제거
const removeFavorite = (title) => {
  localStorage.removeItem(title);
};

// ✅ 해당 title이 찜되어 있는지 여부 확인
const isInFavorites = (title) => {
  return localStorage.getItem(title) !== null;
};

// ✅ 찜 상태 토글 (있으면 제거, 없으면 추가)
export const toggleFavoriteInStorage = (title) => {
  if (isInFavorites(title)) {
    removeFavorite(title);
  } else {
    saveFavorite(title);
  }
};
