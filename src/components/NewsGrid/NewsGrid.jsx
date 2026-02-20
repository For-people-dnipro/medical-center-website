import NewsCard from "../NewsCard/NewsCard";
import "./NewsGrid.css";

export default function NewsGrid({ items = [] }) {
    return (
        <div className="news-grid">
            {items.map((item) => (
                <NewsCard key={item.id || item.slug} item={item} />
            ))}
        </div>
    );
}
