export default function MapPin({ size = 22, color = "#0c8a87" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"
                fill={color}
            />
            <circle cx="12" cy="8.5" r="2.8" fill="#fff" />
        </svg>
    );
}
