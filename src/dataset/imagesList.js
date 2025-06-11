// ✅ Vite 환경에서 안전하게 동작
export const getImagesList = () => {
  const base = import.meta.env.BASE_URL;

  return [
    `${base}assets/kangdongyeob.jpg`,
    `${base}assets/artist.jpg`,
    `${base}assets/canvars.jpg`,
    `${base}assets/sitting.jpg`,
    `${base}assets/sale.jpg`,
    `${base}assets/hanyang_soloists.jpg`,
  ];
};