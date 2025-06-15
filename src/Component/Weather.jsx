import { useState, useEffect } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import weatherIconMap from "../dataset/weatherIcon";
import { getLocationFromCoords, getWeatherByLocationKey } from "../services/axiosServices";

const INITIAL_DATA = {
  city: " ",
  condition: " ",
  temperature: 0 ,
  maxTemp: 0,
  minTemp: 0,
  rainProbability: 0,
};

function Weather() {
    // 📦 상태 정의
    const [weatherData, setWeatherData] = useState(INITIAL_DATA);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    // 캐시 설정
    const CACHE_KEY = "weatherData";
    const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12시간

    // 🌤️ 날씨 API 호출
    const fetchWeather = async () => {
      setLoading(true);
      setError(false);

      try {
        // 📍 현재 위치 가져오기
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // 💾 위치 기반 캐시 확인
        const now = Date.now();
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (cached && now - cached.timestamp < CACHE_DURATION) {
          setWeatherData(cached.data);
          setLoading(false);
          return;
        }

        // 📌 위치 → 도시명 및 키 조회
        const locationData = await getLocationFromCoords(lat, lon);
        const cityName = locationData.LocalizedName;
        const locationKey = locationData.ParentCity?.Key || locationData.Key;

        // 위치 캐싱 (선택적, 추후 사용 가능)
        localStorage.setItem(
          "lastLocation",
          JSON.stringify({ lat, lon, cityName })
        );

        // 🌦️ 날씨 데이터 요청
        const weatherDataRes = await getWeatherByLocationKey(locationKey);
        const current = weatherDataRes.current;
        const forecast = weatherDataRes.forecast;

        // 결과 정리
        const newData = {
          city: cityName,
          condition: current.WeatherText,
          temperature: current.Temperature.Metric.Value,
          maxTemp: forecast.Temperature.Maximum.Value,
          minTemp: forecast.Temperature.Minimum.Value,
          rainProbability: forecast.Day.PrecipitationProbability,
        };

        // 캐시 저장
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
        setLoading(false);
      }
    };

    // ✅ 첫 진입 시 캐시가 있다면 먼저 보여주고, 비동기로 최신 fetch
    useEffect(() => {
      const cachedWeather = localStorage.getItem(CACHE_KEY);
      const cachedLocation = localStorage.getItem("lastLocation");

      if (cachedWeather && cachedLocation) {
        const weather = JSON.parse(cachedWeather);
        setWeatherData(weather.data);
        setLoading(false);
      }

      // 위치 요청은 렌더링 이후 실행
      setTimeout(() => {
        fetchWeather();
      }, 0);
    }, []);

    // 🌤️ 날씨 데이터 구조 분해
    const { city, condition, temperature, maxTemp, minTemp } = weatherData;
    const icon = weatherIconMap[condition] || weatherIconMap["맑음"];

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
          </Col>

          {/* 온도, 최고/최저 */}
          <Col
            xs="auto"
            className="d-flex flex-column align-items-end justify-content-center"
            style={{ flexShrink: 0, maxWidth : 100}}
          >
            <div style={{ fontSize: "28px", fontWeight: 300 }}>{temperature}°</div>
            <div style={{ fontSize: "12px", color: "#888" }}>
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
