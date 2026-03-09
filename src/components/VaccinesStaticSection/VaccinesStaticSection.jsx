import { useEffect, useMemo, useRef, useState } from "react";
import "./VaccinesStaticSection.css";

const vaccines = [
    {
        title: "Харвикс -720 вакцина від гепатиту А (дітям від 1 до 15 років)",
        country: "Бельгія",
    },
    {
        title: "Харвикс-1440 вакцина від гепатиту А (дітям від 16 років та дорослим)",
        country: "Бельгія",
    },
    {
        title: "Твінрикс-вакцина для профілактики гепатитів типу А та В",
        country: "Бельгія",
    },
    {
        title: "Енджерикс-B-вакцина від гепатиту B",
        country: "Бельгія",
    },
    {
        title: "РотаТек-ротавірусна інфекція",
        country: "Нідерланди",
    },
    {
        title: "Ротарікс-ротавірусна інфекція",
        country: "Бельгія",
    },
    {
        title: "Синфлорикс-пневмококова інфекція",
        country: "Бельгія",
    },
    {
        title: "Превенар 13-пневмококова інфекція",
        country: "Бельгія",
    },
    {
        title: "Гардасил-вакцина проти вірусу папіломи людини (ВПЛ)",
        country: "Нідерланди",
    },
    {
        title: "Церварикс-вакцина проти вірусу папіломи людини (ВПЛ)",
        country: "Бельгія",
    },
    {
        title: "М-М-Рвакспро-кір, краснуха, паротит",
        country: "Нідерланди",
    },
    {
        title: "Пріорикс-кір, краснуха, паротит",
        country: "Бельгія",
    },
    {
        title: "Менактра-менінгококова полісахаридна кон'югована вакцина в комплексі з дифтерійним анатоксином",
        country: "США",
    },
    {
        title: "Бексеро-вакцина від менінгококової інфекції серотипу B",
        country: "Італія",
    },
    {
        title: "Німенрикс-вакцина для профілактики менінгококової інфекції",
        country: "Бельгія",
    },
    {
        title: "Варілрикс-для профілактики вітряної віспи жива атенуйована",
        country: "Бельгія",
    },
    {
        title: "Варівакс-вакцина для профілактики вітряної віспи жива атенуйована",
        country: "Нідерланди",
    },
    {
        title: "Бустрікс-дифтерія, кашлюк, правець",
        country: "Бельгія",
    },
    {
        title: "Бустрікс Поліо-дифтерія, кашлюк, правець, поліомієліт",
        country: "Бельгія",
    },
    {
        title: "Інфанрикс-дифтерія, кашлюк, правець",
        country: "Бельгія",
    },
    {
        title: "Інфанрикс ІПВ-дифтерія, кашлюк, правець, поліомієліт",
        country: "Бельгія",
    },
    {
        title: "Інфанрикс ІПВ + ХІБ-дифтерія, кашлюк, правець, поліомієліт, гемофільна паличка",
        country: "Бельгія",
    },
    {
        title: "Інфанрикс Гекса-дифтерія, кашлюк, правець, поліомієліт, гепатит В",
        country: "Бельгія",
    },
    {
        title: "Гексаксім-дифтерія, правець, кашлюк, поліомієліт, гепатит В, гемофільна паличка тип В",
        country: "Франція",
    },
];

export default function VaccinesStaticSection() {
    const listRef = useRef(null);
    const scrollbarThumbRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const listElement = listRef.current;
        if (!listElement) return;

        const threshold = 2;

        const updateScrollState = () => {
            const hasOverflow =
                listElement.scrollHeight - listElement.clientHeight > threshold;
            setIsScrollable(hasOverflow);

            const thumbElement = scrollbarThumbRef.current;
            if (thumbElement) {
                const clientHeight = listElement.clientHeight;
                const scrollHeight = listElement.scrollHeight;
                const scrollTop = listElement.scrollTop;

                const thumbHeight = hasOverflow
                    ? Math.max(
                          28,
                          Math.round(
                              (clientHeight / scrollHeight) * clientHeight,
                          ),
                      )
                    : clientHeight;

                const maxThumbTop = Math.max(0, clientHeight - thumbHeight);
                const scrollRange = Math.max(1, scrollHeight - clientHeight);
                const thumbTop = hasOverflow
                    ? Math.round((scrollTop / scrollRange) * maxThumbTop)
                    : 0;

                thumbElement.style.height = `${thumbHeight}px`;
                thumbElement.style.transform = `translateY(${thumbTop}px)`;
            }

            if (!hasOverflow) {
                setIsAtBottom(true);
                return;
            }

            const reachedBottom =
                listElement.scrollTop + listElement.clientHeight >=
                listElement.scrollHeight - threshold;

            setIsAtBottom(reachedBottom);
        };

        updateScrollState();

        const resizeObserver = new ResizeObserver(updateScrollState);
        resizeObserver.observe(listElement);

        listElement.addEventListener("scroll", updateScrollState, {
            passive: true,
        });
        window.addEventListener("resize", updateScrollState);

        return () => {
            resizeObserver.disconnect();
            listElement.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, []);

    const sortedVaccines = useMemo(() => {
        return [...vaccines].sort((a, b) =>
            a.title.localeCompare(b.title, "uk-UA", { sensitivity: "base" }),
        );
    }, []);

    const showFadeOverlay = isScrollable && !isAtBottom;

    return (
        <section className="vaccines-static">
            <div className="vaccines-static__container">
                <div className="vaccines-static__card">
                    <h2 className="vaccines-static__title">
                        <span className="vaccines-static__title-desktop">
                            ПЕРЕЛІК ВАКЦИН, ДОСТУПНИХ ДЛЯ ЗАМОВЛЕННЯ
                        </span>
                        <span className="vaccines-static__title-mobile">
                            ПЕРЕЛІК ДОСТУПНИХ ВАКЦИН
                        </span>
                    </h2>

                    <p className="vaccines-static__subtitle">
                        Асортимент вакцин може змінюватися через логістику та
                        перебої з електропостачанням
                    </p>

                    <div className="vaccines-static__list-wrapper">
                        <div ref={listRef} className="vaccines-static__list">
                            {sortedVaccines.map((vaccine, index) => (
                                <div
                                    key={index}
                                    className="vaccines-static__item"
                                >
                                    <span className="vaccines-static__name">
                                        {vaccine.title}
                                    </span>

                                    <span className="vaccines-static__badge">
                                        {vaccine.country}
                                    </span>
                                </div>
                            ))}

                            <div className="vaccines-static__note-row">
                                <p className="vaccines-static__note">
                                    Не знайшли потрібну вакцину? Зверніться до
                                    нас — організуємо індивідуальне замовлення.
                                </p>
                            </div>
                        </div>

                        <div
                            className="vaccines-static__scrollbar"
                            aria-hidden="true"
                        >
                            <span
                                ref={scrollbarThumbRef}
                                className="vaccines-static__scrollbar-thumb"
                            />
                        </div>

                        {showFadeOverlay ? (
                            <div
                                className="vaccines-static__fade"
                                aria-hidden="true"
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}
