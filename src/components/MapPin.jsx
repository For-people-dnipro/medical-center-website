export default function MapPin({ size = 28 }) {
    return (
        <svg
            width={size}
            height={size * 1.3}
            viewBox="0 0 28 36"
            className="branches-pin-svg"
        >
            <path
                d="M14 2 
                   C10 2, 2 8, 2 14 
                   C2 22, 14 34, 14 34 
                   C14 34, 26 22, 26 14 
                   C26 8, 18 2, 14 2 Z"
                fill="#0c8a87"
            />
            <circle cx="14" cy="14" r="5" fill="white" />
        </svg>
    );
}
