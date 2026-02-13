import WeatherIconMap from "@/constants/WeatherIcons";
import { useData } from "@/contexts/DataContext";

const getWeatherIconKey = (sky: string): keyof typeof WeatherIconMap => {
  if (sky.includes("맑음")) return "sunny";
  if (sky.includes("구름")) return "cloudy";
  if (sky.includes("비")) return "rain";
  if (sky.includes("눈")) return "snow";
  if (sky.includes("흐림")) return "fog";
  return "sunny";
};

const WeatherLocation = () => {
  const { weather } = useData();

  if (!weather) return null;

  const temperature = weather.current.temperature.toFixed(1);
  const iconKey = getWeatherIconKey(weather.current.sky);
  const WeatherIcon = WeatherIconMap[iconKey];

  return (
    <article
      className="min-w-36 h-10 flex items-center gap-2 px-3 py-2 rounded-full shadow-md transition-all duration-300"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px' }}
    >
      <WeatherIcon className="text-yellow-500 shrink-0" size={24} />

      <div className="flex items-center gap-1.5 whitespace-nowrap">
        {weather.forecast && (
          <div className="flex flex-row items-center text-xs leading-tight">
            <span style={{ color: 'var(--text-secondary)' }}>{weather.forecast.maxTemp}°</span>
            <span style={{ color: 'var(--text-secondary)' }}>{weather.forecast.minTemp}°</span>
            <span style={{ color: 'var(--text-secondary)' }}>{weather.current.sky}</span>
          </div>
        )}
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>서울시</span>
      </div>
    </article>
  );
};

export { WeatherLocation };
