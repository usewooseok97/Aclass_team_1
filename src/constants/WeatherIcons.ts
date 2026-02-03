import {
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  CloudLightning,
  CloudFog,
  Sunset,
  Moon,
  type LucideIcon,
} from "lucide-react";

const WeatherIconMap: Record<string, LucideIcon> = {
  sunny: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  snow: Snowflake,
  thunderstorm: CloudLightning,
  fog: CloudFog,
  day: Sun,
  sunset: Sunset,
  night: Moon,
};

export default WeatherIconMap;
