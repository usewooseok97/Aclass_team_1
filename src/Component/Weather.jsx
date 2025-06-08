import { useState, useEffect } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import weatherIconMap from "../dataset/weatherIcon";
import { getLocationFromCoords, getWeatherByLocationKey } from "../services/axiosServices";

const INITIAL_DATA = {
  city: "Loading...",
  condition: "Sunny",
  temperature: 0,
  maxTemp: 0,
  minTemp: 0,
  rainProbability: 0,
};

function Weather() {
  const [weatherData, setWeatherData] = useState(INITIAL_DATA);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);

    try {
      // ✅ 위치 정보를 가져오는 비동기 작업을 Promise로 감싸서 await할 수 있도록 처리
      // 성공 시 → resolve 함수 호출 실패 시 → reject 함수 호출
      
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const locationData = await getLocationFromCoords(lat, lon);
      const cityName = locationData.LocalizedName;
      const locationKey = locationData.ParentCity?.Key || locationData.Key;

      const weatherDataRes = await getWeatherByLocationKey(locationKey);
      const current = weatherDataRes.current;
      const forecast = weatherDataRes.forecast;

      setWeatherData({
        city: cityName,
        condition: current.WeatherText,
        temperature: current.Temperature.Metric.Value,
        maxTemp: forecast.Temperature.Maximum.Value,
        minTemp: forecast.Temperature.Minimum.Value,
        rainProbability: forecast.Day.PrecipitationProbability,
      });

      setLoading(false);
    } catch (err) {
      console.error("❌ 위치 또는 날씨 데이터 오류:", err);
      setError(true);
      setWeatherData(INITIAL_DATA);
      setLoading(false); // ✅ 여기까지 반드시 도달하게 됨
    }
  };

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
