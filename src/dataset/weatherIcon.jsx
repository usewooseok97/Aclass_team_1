import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from "react-icons/wi";

const weatherIconMap = {
  "맑음": <WiDaySunny size={64} color="#FFD700" />,
  "흐림": <WiCloudy size={64} color="#aaa" />,
  "비": <WiRain size={64} color="#4a90e2" />,
  "눈": <WiSnow size={64} color="#00d4ff" />,
  "번개": <WiThunderstorm size={64} color="#888" />,
  "안개": <WiFog size={64} color="#bbb" />,
};
export default weatherIconMap