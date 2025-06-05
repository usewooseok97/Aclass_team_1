import { useState, useEffect } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import weatherIconMap from "../dataset/weatherIcon";
import axios from "axios";
import { WiRefresh } from "react-icons/wi"; // 이거 빠져 있었으면 꼭 import 해줘!

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
          const locationRes = await axios.get("http://localhost:5001/api/location", {
            params: { lat, lon },
          });

          const locationData = locationRes.data;
          const cityName = locationData.LocalizedName;
          const locationKey = locationData.ParentCity?.Key || locationData.Key;

          // 2. 프록시 서버 통해 날씨 정보 요청
          const weatherRes = await axios.get(`http://localhost:5001/api/weather/${locationKey}`);

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
      <Row className="align-items-center">
        <Col xs="auto">{icon}</Col>
        <Col>
          <div style={{ fontWeight: "bold", fontSize: "20px" }}>{city}</div>
          <div style={{ color: "#666", fontSize: "14px" }}>{condition}</div>
          <div style={{ color: "#666", fontSize: "14px" }}>
            비 올 확률: {rainProbability}%
          </div>
        </Col>
        <Col xs="auto" className="text-end">
          <div style={{ fontSize: "32px", fontWeight: 300 }}>{temperature}°</div>
          <div style={{ fontSize: "14px", color: "#888" }}>
            {maxTemp}° / {minTemp}°
          </div>
        </Col>
        {error && (
          <Col xs={12} className="text-center mt-3">
            <WiRefresh
              size={32}
              color="#888"
              style={{ cursor: "pointer" }}
              onClick={fetchWeather}
              title="다시 시도"
            />
            <div style={{ fontSize: "14px", color: "#888" }}>데이터 불러오기 실패. 다시 시도하세요.</div>
          </Col>
        )}
      </Row>
    </Card>
  );
}

const cardStyle = {
  width: "100%",
  maxWidth: "400px",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "20px",
  padding: "20px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  color: "#000",
};

export default Weather;
