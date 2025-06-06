import { useState, useEffect } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import weatherIconMap from "../dataset/weatherIcon";
import axios from "axios";
import { WiRefresh } from "react-icons/wi";

const baseURL = import.meta.env.VITE_WEATHER_KEY

function Weather() {
  const [weatherData, setWeatherData] = useState({
    city: "Loading...",
    condition: "Sunny",
    temperature: 0,
    maxTemp: 0,
    minTemp: 0,
    rainProbability: 0,
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // 1. 프록시 서버 통해 위치 정보 요청
          const locationRes = await axios.get(`${baseURL}/api/location`, { params: { lat, lon } });

          const locationData = locationRes.data;
          const cityName = locationData.LocalizedName;
          const locationKey = locationData.ParentCity?.Key || locationData.Key;

          // 2. 프록시 서버 통해 날씨 정보 요청
          const weatherRes = await axios.get(`${baseURL}/api/weather/${locationKey}`);

          const current = weatherRes.data.current;
          const forecast = weatherRes.data.forecast;

          // 3. 상태 저장
          setWeatherData({
            city: cityName,
            condition: current.WeatherText,
            temperature: current.Temperature.Metric.Value,
            maxTemp: forecast.Temperature.Maximum.Value,
            minTemp: forecast.Temperature.Minimum.Value,
            rainProbability: forecast.Day.PrecipitationProbability,
          });

          setLoading(false);
        },
        (err) => {
          console.error("위치 권한 거부 또는 오류:", err);
          setError(true);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("날씨 데이터 호출 실패:", err);
      setError(true);
      setLoading(false);
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
