import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";

const WeatherIconMap = () => {
  return (
    <>
      <WiDaySunny size={64} color="#FFD700" />
      <WiCloudy size={64} color="#aaa" />
      <WiRain size={64} color="#4a90e2" />
      <WiSnow size={64} color="#00d4ff" />
      <WiThunderstorm size={64} color="#888" />
      <WiFog size={64} color="#bbb" />
    </>
  );
};
export default WeatherIconMap;
