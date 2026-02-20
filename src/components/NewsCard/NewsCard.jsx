import { Link } from "react-router-dom";
import { formatNewsDate } from "../../api/newsApi";
import "./NewsCard.css";

export default function NewsCard({ item }) {
    const dateLabel = formatNewsDate(item.publishedDate);

    let dateTime = "";
    if (item.publishedDate) {
        const parsedDate = new Date(item.publishedDate);
        if (!Number.isNaN(parsedDate.getTime())) {
            dateTime = parsedDate.toISOString();
        }
    }

    return (
        <article className="news-card">
            <Link to={`/news/${item.slug}`} className="news-card__link">
                <div className="news-card__media">
                    {item.coverImage?.url ? (
                        <img
                            className="news-card__image"
                            src={item.coverImage.url}
                            alt={item.coverImage.alt || item.title}
                            width={item.coverImage.width}
                            height={item.coverImage.height}
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        <div
                            className="news-card__image news-card__image--placeholder"
                            aria-hidden="true"
                        />
                    )}
                </div>

                <div className="news-card__body">
                    <h3 className="news-card__title">{item.title}</h3>

                    {item.shortDescription ? (
                        <p className="news-card__description">
                            {item.shortDescription}
                        </p>
                    ) : null}

                    <div className="news-card__footer">
                        {dateLabel ? (
                            <time
                                dateTime={dateTime || undefined}
                                className="news-card__date"
                            >
                                {dateLabel}
                            </time>
                        ) : (
                            <span className="news-card__date" />
                        )}

                        <span className="news-card__arrow" aria-hidden="true">
                            <img src="/icons/arrow-right.svg" alt="" />
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
