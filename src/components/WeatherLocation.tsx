import { useState } from "react";
import WeatherIconMap from "../constants/WeatherIcons";

interface WeatherData {
  current: {
    temperature: number;
    sky: string;
    humidity?: number;
    windSpeed?: number;
  };
  forecast?: {
    maxTemp: number;
    minTemp: number;
    sky: string;
  };
}

const getWeatherIconKey = (sky: string): keyof typeof WeatherIconMap => {
  const skyLower = sky.toLowerCase();
  if (skyLower.includes("맑음")) return "sunny";
  if (skyLower.includes("구름")) return "cloudy";
  if (skyLower.includes("비")) return "rain";
  if (skyLower.includes("눈")) return "snow";
  if (skyLower.includes("흐림")) return "fog";
  return "sunny";
};

const WeatherLocation = () => {
  const [location] = useState("동작구");

  const weatherData: WeatherData = {
    current: {
      temperature: 22.1,
      sky: "맑음",
    },
  };

  const temperature = weatherData.current.temperature.toFixed(1);
  const iconKey = getWeatherIconKey(weatherData.current.sky);
  const WeatherIcon = WeatherIconMap[iconKey];

  return (
    <article className=" min-w-36 h-10 flex items-center gap-2 px-3 py-2 rounded-full shadow-md transition-all duration-300 ">
      <WeatherIcon className="text-yellow-500 shrink-0" size={24} />

      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <div className="flex flex-col items-start text-xs leading-tight">
          <span className="font-semibold text-gray-800">{temperature}°C</span>
          <span className="text-gray-800">{weatherData.current.sky}</span>
        </div>
        <span className="text-gray-800 font-medium">{location}</span>
      </div>
    </article>
  );
};

export { WeatherLocation };
