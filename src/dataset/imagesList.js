// Vite 환경에서 안전하게 동작
const base = import.meta.env.BASE_URL;

export const getImagesList = () => {

  return [
    `${base}assets/kangdongyeob.jpg`,
    `${base}assets/artist.jpg`,
    `${base}assets/canvars.jpg`,
    `${base}assets/sitting.jpg`,
    `${base}assets/sale.jpg`,
    `${base}assets/hanyang_soloists.jpg`,
  ];
};

export const seasonImageMap = {
  봄: `${base}assets/springs.png`,
  여름: `${base}assets/summers.png`,
  가을: `${base}assets/falls.png`,
  겨울: `${base}assets/winters.png`
};
