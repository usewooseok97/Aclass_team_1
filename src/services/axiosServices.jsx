import axios from 'axios';

// ✅ API 기본 주소 (환경변수)
const baseURL = import.meta.env.VITE_SEOUL_KEY;

export const getFestivalData = async () => {
  const response = await axios.get(`${baseURL}/api/festivals`);
  return response.data;
};

export const getLocationFromCoords = async (lat, lon) => {
  const res = await axios.get(`${baseURL}/api/location`, { params: { lat, lon } });
  return res.data;
};

export const getWeatherByLocationKey = async (locationKey) => {
  const res = await axios.get(`${baseURL}/api/weather/${locationKey}`);
  return res.data;
};