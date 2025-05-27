import { useState , useEffect } from "react";
import { Card, Row, Col , Spinner  } from "react-bootstrap";
import  weatherIconMap  from "../dataset/weatherIcon";
import axios from "axios";
function Weather(){

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
        const apiKey = import.meta.env.VITE_WEATHER_KEY;

        try {
            navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                // 1. 위치 정보로 Location 정보 받기
                const locationRes = await axios.get(
                `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search`,
                {
                    params: {
                    apikey: apiKey,
                    q: `${lat},${lon}`,
                    language: "ko",
                    },
                }
                );
                const locationData = locationRes.data;
                const cityName = locationData.LocalizedName; // ex: 고척1동
                const locationKey = locationData.ParentCity?.Key || locationData.Key;
                // 2. 현재 날씨 및 예보 호출
                const [currentRes, forecastRes] = await Promise.all([
                axios.get(`https://dataservice.accuweather.com/currentconditions/v1/${locationKey}`,{
                    params: {
                        apikey: apiKey,
                        language: "ko",
                    },
                    }
                ),
                axios.get(
                    `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}`,
                    {
                    params: {
                        apikey: apiKey,
                        language: "ko",
                        metric: true,
                    },
                    }
                ),
                ]);
                const current = currentRes.data[0];
                const forecast = forecastRes.data.DailyForecasts[0];

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
};

const cardStyle = {
  width: "100%",
  maxWidth: "400px",
  backgroundColor: "rgba(255, 255, 255, 0.15)", // 더 부드러운 반투명
  backdropFilter: "blur(12px)",                 // 블러 정도 살짝 증가
  WebkitBackdropFilter: "blur(12px)",           // Safari 대응
  borderRadius: "20px",                         // 둥글게
  padding: "20px",
  border: "1px solid rgba(255, 255, 255, 0.3)",  // 유리 경계선
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",    // 살짝 그림자 추가
  color: "#000",                                 // 텍스트는 어두운 색 유지
};


export default Weather