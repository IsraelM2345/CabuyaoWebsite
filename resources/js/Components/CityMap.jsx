import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    Sun,
    Cloud,
    CloudRain,
    CloudLightning,
    Wind,
    Droplets,
} from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const cityHallIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Cabuyao City coordinates (City Hall)
const CABUYAO_CENTER = [14.8058, 121.1353];

// Points of interest in Cabuyao
const POINTS_OF_INTEREST = [
    {
        id: 1,
        name: "City Hall",
        position: [14.8058, 121.1353],
        description: "City Government of Cabuyao",
        icon: cityHallIcon,
    },
    {
        id: 2,
        name: "Cabuyao Church",
        position: [14.8067, 121.1342],
        description: "Saint Stanislaus Kostka Parish Church",
    },
    {
        id: 3,
        name: "City Plaza",
        position: [14.8072, 121.1365],
        description: "Cabuyao Town Plaza",
    },
    {
        id: 4,
        name: "PACU Arena",
        position: [14.8045, 121.138],
        description: "Pedro A. Cheng Community Center & Arena",
    },
    {
        id: 5,
        name: "Cabuyao Integrated Terminal",
        position: [14.8089, 121.132],
        description: "Main transportation hub",
    },
];

// Component to handle map interactions
function MapController({ onMapLoad }) {
    const map = useMap();

    useEffect(() => {
        if (onMapLoad) {
            onMapLoad(map);
        }
    }, [map, onMapLoad]);

    return null;
}

// Weather data for Cabuyao (simulated - in production, you'd fetch from an API)
const getWeatherData = () => {
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
        temperature: Math.floor(Math.random() * (35 - 24) + 24),
        feelsLike: Math.floor(Math.random() * (37 - 26) + 26),
        humidity: Math.floor(Math.random() * (90 - 60) + 60),
        windSpeed: Math.floor(Math.random() * (20 - 5) + 5),
        condition: currentWeather.condition,
        icon: currentWeather.icon,
        color: currentWeather.color,
    };
};

export default function CityMap() {
    const mapRef = useRef(null);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        setWeather(getWeatherData());
    }, []);

    const handleMapLoad = (map) => {
        mapRef.current = map;
    };

    return (
        <section className="w-full py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Explore{" "}
                        <span className="text-red-600">Cabuyao City</span>
                    </h2>
                    <div className="flex justify-center mb-6">
                        <div className="flex h-1 w-24">
                            <div className="w-1/3 h-full bg-blue-600"></div>
                            <div className="w-1/3 h-full bg-yellow-400"></div>
                            <div className="w-1/3 h-full bg-red-600"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Discover key locations and landmarks in the City of
                        Cabuyao. Click on markers to learn more about each
                        location.
                    </p>
                </div>

                {/* Map Container - Wide and Responsive */}
                <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    {/* Map with responsive height */}
                    <div className="w-full" style={{ height: "500px" }}>
                        <MapContainer
                            center={CABUYAO_CENTER}
                            zoom={14}
                            style={{ width: "100%", height: "100%" }}
                            className="z-0"
                            scrollWheelZoom={true}
                            doubleClickZoom={true}
                            dragging={true}
                            zoomControl={true}
                        >
                            {/* Using OpenStreetMap standard tiles - has the most street labels among free options */}
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                maxZoom={19}
                            />

                            <MapController onMapLoad={handleMapLoad} />

                            {/* Markers for points of interest */}
                            {POINTS_OF_INTEREST.map((poi) => (
                                <Marker
                                    key={poi.id}
                                    position={poi.position}
                                    icon={poi.icon || cityHallIcon}
                                >
                                    <Popup>
                                        <div className="p-2">
                                            <h3 className="font-bold text-gray-900 mb-1">
                                                {poi.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {poi.description}
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>

                    {/* Bottom-Left Overlays Container - Weather above Location Info */}
                    <div className="absolute bottom-6 left-6 z-[10] flex flex-col gap-3">
                        {/* Weather Widget */}
                        {weather && (
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-100">
                                <div className="flex items-center gap-2.5">
                                    <weather.icon
                                        className={`${weather.color}`}
                                        size={18}
                                    />
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-base text-gray-900">
                                            {weather.temperature}°C
                                        </span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-200"></div>
                                    <div className="flex items-center gap-1">
                                        <Droplets
                                            size={10}
                                            className="text-blue-500"
                                        />
                                        <span className="text-[10px] text-gray-600">
                                            {weather.humidity}%
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Wind
                                            size={10}
                                            className="text-green-500"
                                        />
                                        <span className="text-[10px] text-gray-600">
                                            {weather.windSpeed}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Location Info Card */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-sm border border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-6 h-6 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">
                                        Cabuyao City
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Located in Laguna Province, Philippines
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                                            14.8058° N
                                        </span>
                                        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">
                                            121.1353° E
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive hint - Top Right */}
                    <div className="absolute top-6 right-6 z-[10] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2 border border-gray-100">
                        <p className="text-xs text-gray-600 font-medium flex items-center gap-2">
                            <svg
                                className="w-4 h-4 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                                />
                            </svg>
                            Click & drag to explore • Scroll to zoom
                        </p>
                    </div>
                </div>

                {/* Points of Interest Legend */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {POINTS_OF_INTEREST.map((poi) => (
                        <button
                            key={poi.id}
                            onClick={() => {
                                if (mapRef.current) {
                                    mapRef.current.flyTo(poi.position, 16, {
                                        duration: 1.5,
                                    });
                                    // Close all popups first
                                    mapRef.current.closePopup();
                                }
                            }}
                            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 text-left transition-all duration-300 hover:shadow-lg hover:border-red-200 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                    <svg
                                        className="w-4 h-4 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">
                                        {poi.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {poi.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
