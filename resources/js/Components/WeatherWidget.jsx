import React, { useState, useEffect } from "react";
import {
    Sun,
    Cloud,
    CloudRain,
    CloudLightning,
    Wind,
    Droplets,
    Thermometer,
} from "lucide-react";

// Weather data for Cabuyao (simulated - in production, you'd fetch from an API)
const getWeatherData = () => {
    // Simulated weather data for Cabuyao, Laguna
    // In production, replace with actual API call to OpenWeatherMap or similar
    const weatherConditions = [
        { condition: "Sunny", icon: Sun, color: "text-yellow-500" },
        { condition: "Partly Cloudy", icon: Cloud, color: "text-gray-500" },
        { condition: "Cloudy", icon: Cloud, color: "text-gray-600" },
        { condition: "Rainy", icon: CloudRain, color: "text-blue-500" },
        {
            condition: "Thunderstorm",
            icon: CloudLightning,
            color: "text-purple-500",
        },
    ];

    const currentWeather =
        weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

    return {
        temperature: Math.floor(Math.random() * (35 - 24) + 24), // 24-35°C
        feelsLike: Math.floor(Math.random() * (37 - 26) + 26), // 26-37°C
        humidity: Math.floor(Math.random() * (90 - 60) + 60), // 60-90%
        windSpeed: Math.floor(Math.random() * (20 - 5) + 5), // 5-20 km/h
        condition: currentWeather.condition,
        icon: currentWeather.icon,
        color: currentWeather.color,
        location: "Cabuyao, Laguna",
        lastUpdated: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
};

export default function WeatherWidget() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call delay
        const timer = setTimeout(() => {
            setWeather(getWeatherData());
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-white/90 text-xs">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading weather...</span>
            </div>
        );
    }

    const WeatherIcon = weather.icon;

    return (
        <div className="flex items-center gap-4 text-white/90 text-xs">
            {/* Temperature Display */}
            <div className="flex items-center gap-2">
                <WeatherIcon className={`${weather.color}`} size={18} />
                <div className="flex items-center gap-1">
                    <span className="font-bold text-lg">
                        {weather.temperature}°
                    </span>
                    <span className="text-white/70">C</span>
                </div>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/30"></div>

            {/* Humidity */}
            <div className="flex items-center gap-1.5">
                <Droplets size={14} className="text-blue-300" />
                <span className="font-medium">{weather.humidity}%</span>
            </div>

            {/* Wind Speed */}
            <div className="hidden md:flex items-center gap-1.5">
                <Wind size={14} className="text-green-300" />
                <span className="font-medium">{weather.windSpeed} km/h</span>
            </div>

            {/* Location */}
            <div className="hidden lg:block text-white/70 text-[10px]">
                {weather.location}
            </div>
        </div>
    );
}
