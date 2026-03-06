import NewsCard from "../NewsCard/NewsCard";
import "./NewsGrid.css";

export default function NewsGrid({ items = [] }) {
    return (
        <div className="news-grid">
            {items.map((item, index) => (
                <NewsCard
                    key={item.id || item.slug}
                    item={item}
                    priority={index < 3}
                />
            ))}
        </div>
    );
}
