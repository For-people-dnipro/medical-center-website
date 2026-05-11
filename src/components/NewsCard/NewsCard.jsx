import { Link } from "react-router-dom";
import { formatNewsDate, prefetchNewsBySlug } from "../../api/newsApi";
import { getResponsiveImageProps } from "../../api/foundation";
import "./NewsCard.css";

export default function NewsCard({ item, priority = false }) {
    const dateLabel = formatNewsDate(item.publishedDate);
    const cardImage = item.coverImageCard || item.coverImage;
    const newsTitle = String(item?.title || "Новина").trim();
    const newsImageAlt = `${newsTitle} — медичний центр Для Людей, Дніпро`;
    const imageLoading = priority ? "eager" : "lazy";
    const imageFetchPriority = priority ? "high" : "auto";
    const imageProps = getResponsiveImageProps(cardImage, {
        variant: "card",
        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    });
    const handlePrefetch = () => {
        if (!item?.slug) return;
        prefetchNewsBySlug(item.slug);
    };

    let dateTime = "";
    if (item.publishedDate) {
        const parsedDate = new Date(item.publishedDate);
        if (!Number.isNaN(parsedDate.getTime())) {
            dateTime = parsedDate.toISOString();
        }
    }

        return (
        <article className="news-card">
            <Link
                to={`/news/${item.slug}`}
                className="news-card__link"
                state={{ newsItem: item }}
                onMouseEnter={handlePrefetch}
                onFocus={handlePrefetch}
                onTouchStart={handlePrefetch}
            >
                <div className="news-card__media">
                    {imageProps?.src ? (
                        <img
                            className="news-card__image"
                            src={imageProps.src}
                            srcSet={imageProps.srcSet}
                            sizes={imageProps.sizes}
                            alt={newsImageAlt}
                            width={imageProps.width}
                            height={imageProps.height}
                            loading={imageLoading}
                            fetchpriority={imageFetchPriority}
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

                    {/* {item.shortDescription ? (
                        <p className="news-card__description">
                            {item.shortDescription}
                        </p>
                    ) : null} */}

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
