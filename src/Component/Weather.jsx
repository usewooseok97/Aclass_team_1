import { useState, useEffect } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import weatherIconMap from "../dataset/weatherIcon";
import { getLocationFromCoords, getWeatherByLocationKey } from "../services/axiosServices";

const INITIAL_DATA = {
  city: "구로구",
  condition: "Sunny",
  temperature: 27,
  maxTemp: 29,
  minTemp: 20,
  rainProbability: 0,
};

function Weather() {
  // 📦 상태 정의
  const [weatherData, setWeatherData] = useState(INITIAL_DATA); // 날씨 데이터
  const [error, setError] = useState(false);                    // 오류 상태
  const [loading, setLoading] = useState(true);                 // 로딩 상태

  // ⏳ 캐시 설정
  const CACHE_KEY = "weatherData";                // localStorage 키
  const CACHE_DURATION = 20 * 60 * 1000;          // 20분 (ms)

  // 🌤️ 날씨 데이터 가져오기
  const fetchWeather = async () => {
    setLoading(true);   // 로딩 시작
    setError(false);    // 에러 초기화

    try {
      // 📍 현재 위치 좌표 가져오기 (비동기)
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // 💾 localStorage 캐시 확인
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      const now = Date.now();

      // ✅ 캐시가 유효하면 API 호출 생략
      if (cached && now - cached.timestamp < CACHE_DURATION) {
        setWeatherData(cached.data);
        setLoading(false);
        return;
      }

      // 📌 위치 키 조회
      const locationData = await getLocationFromCoords(lat, lon);
      const cityName = locationData.LocalizedName;
      const locationKey = locationData.ParentCity?.Key || locationData.Key;

      // 🌦️ 날씨 데이터 호출
      const weatherDataRes = await getWeatherByLocationKey(locationKey);
      const current = weatherDataRes.current;
      const forecast = weatherDataRes.forecast;

      // 📊 날씨 정보 정리
      const newData = {
        city: cityName,
        condition: current.WeatherText,
        temperature: current.Temperature.Metric.Value,
        maxTemp: forecast.Temperature.Maximum.Value,
        minTemp: forecast.Temperature.Minimum.Value,
        rainProbability: forecast.Day.PrecipitationProbability,
      };

      // 💽 캐시 저장
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: now, data: newData })
      );

      setWeatherData(newData);
      setLoading(false);
    } catch (err) {
      console.error("❌ 날씨 불러오기 실패:", err);
      setError(true);
      setWeatherData(INITIAL_DATA);
      setLoading(false); // 에러 발생해도 로딩 종료
    }
  };

  // 🚀 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    fetchWeather();
  }, []);

  const { city, condition, temperature, maxTemp, minTemp, rainProbability } = weatherData;
  const icon = weatherIconMap[condition] || weatherIconMap["Sunny"];

  if (loading) {
    return (
      <Card className="p-4 text-center" style={cardStyle}>
        <Spinner animation="border" variant="primary" />
      </Card>
    );
  }

  return (
      <Card style={cardStyle}>
        <Row className="d-flex justify-content-between align-items-center flex-nowrap">
          {/* 날씨 아이콘 */}
          <Col
            xs="auto"
            className="d-flex flex-column align-items-center"
            style={{ flexShrink: 0  , maxWidth : 120}}
          >
            {icon}
          </Col>

          {/* 도시명, 상태, 비올 확률 */}
          <Col
            className="d-flex flex-column justify-content-center"
            style={{ minWidth: 120 }} // 줄바꿈 방지 + 내부 텍스트 overflow 대응
          >
            <div style={{ fontWeight: "bold", fontSize: "18px" }}>{city}</div>
            <div style={{ color: "#666", fontSize: "14px" }}>{condition}</div>
            <div style={{ color: "#666", fontSize: "14px" }}>
              비 올 확률: {rainProbability}%
            </div>
          </Col>

          {/* 온도, 최고/최저 */}
          <Col
            xs="auto"
            className="d-flex flex-column align-items-end justify-content-center"
            style={{ flexShrink: 0, maxWidth : 100}}
          >
            <div style={{ fontSize: "28px", fontWeight: 300 }}>{temperature}°</div>
            <div style={{ fontSize: "14px", color: "#888" }}>
              {maxTemp}° / {minTemp}°
            </div>
          </Col>
        </Row>
      </Card>
  );
}

const cardStyle = {
  width: "100%",
  maxWidth: "400px",
  height: "100%",
  backgroundColor: "transparent",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "20px",
  padding: "5px",
  border: "0px",
};

export default Weather;
