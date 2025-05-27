import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from "react-icons/wi";

const weatherIconMap = {
  "Sunny": <WiDaySunny size={64} color="#FFD700" />,
  "Clear": <WiDaySunny size={64} color="#FFD700" />,
  "Partly cloudy": <WiCloudy size={64} color="#ccc" />,
  "Cloudy": <WiCloudy size={64} color="#aaa" />,
  "Rain": <WiRain size={64} color="#4a90e2" />,
  "Snow": <WiSnow size={64} color="#00d4ff" />,
  "Thunderstorm": <WiThunderstorm size={64} color="#888" />,
  "Fog": <WiFog size={64} color="#bbb" />,
};
export default weatherIconMap