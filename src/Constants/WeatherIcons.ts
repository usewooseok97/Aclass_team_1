import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiSunset,
  WiNightClear,
} from "react-icons/wi";
import type { IconType } from "react-icons";

const WeatherIconMap: Record<string, IconType> = {
  sunny: WiDaySunny,
  cloudy: WiCloudy,
  rain: WiRain,
  snow: WiSnow,
  thunderstorm: WiThunderstorm,
  fog: WiFog,
  day: WiDaySunny,
  sunset: WiSunset,
  night: WiNightClear,
};

export default WeatherIconMap;
