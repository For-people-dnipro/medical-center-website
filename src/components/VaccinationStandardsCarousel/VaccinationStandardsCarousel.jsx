import { useRef } from "react";
import WebPImage from "../WebPImage/WebPImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import "./VaccinationStandardsCarousel.css";

const slides = [
    {
        title: "ДОТРИМАННЯ ХОЛОДОВОГО ЛАНЦЮГА",
        text: "Температурний контроль при транспортуванні та зберігання у холодильнику, сертифікованому МОЗ, з безперервним моніторингом і резервним живленням.",
        image: "/images/data-logers.jpg",
    },
    {
        title: "ОФІЦІЙНІ СЕРТИФІКОВАНІ ПРЕПАРАТИ",
        text: "Медичний центр працює лише з зареєстрованими вакцинами від перевіреного постачальника ТОВ «ВЕНТА. ЛТД»-національного фармацевтичного дистрибьютора, який працює з 1995 року.",
        image: "/images/certificate-injections.jpg",
    },
    {
        title: "ОГЛЯД ЛІКАРЯ ПЕРЕД ВАКЦИНАЦІЄЮ",
        text: "Перед щепленням пацієнта обов’язково оглядає лікар, щоб виключити протипоказання та зменшити ризики та прояв післявакцинальних ускладнень",
        image: "/images/consultation-before-vaccine.jpg",
    },
    {
        title: "БЕЗПЕЧНЕ ВВЕДЕННЯ ТА НАГЛЯД",
        text: "Вакцинацію проводить медичний персонал із дотриманням усіх протоколів, із подальшим наглядом після інʼєкції.",
        image: "/images/consult-after-vaccine.jpg",
    },
    {
        title: "ОФІЦІЙНИЙ ОБЛІК ЩЕПЛЕННЯ",
        text: "Запис у медичній документації, внесення даних до центральної бази даних ЕСОЗ (електронної системи охорони здоровʼя)",
        image: "/images/consult-docs.jpg",
    },
];

export default function VaccinationStandardsCarousel() {
    const swiperRef = useRef(null);
    const transitionSpeed = 650;

    const goToPrevSlide = () => {
        swiperRef.current?.slidePrev();
    };

    const goToNextSlide = () => {
        swiperRef.current?.slideNext();
    };

    const handleKeyDown = (event) => {
        if (!swiperRef.current) {
            return;
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            goToPrevSlide();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            goToNextSlide();
        }
    };

    return (
        <section
            className="vaccination-standards-carousel"
            aria-labelledby="vaccination-standards-carousel-title"
        >
            <div className="vaccination-standards-carousel__container">
                <div className="vaccination-standards-carousel__header">
                    <h2
                        className="vaccination-standards-carousel__title"
                        id="vaccination-standards-carousel-title"
                    >
                        <span className="vaccination-standards-carousel__title-desktop">
                            Наші стандарти безпеки та якості
                        </span>
                        <span className="vaccination-standards-carousel__title-mobile">
                            Стандарти якості
                        </span>
                    </h2>

                    <div className="vaccination-standards-carousel__controls">
                        <button
                            type="button"
                            className="vaccination-standards-carousel__arrow vaccination-standards-carousel__arrow--prev"
                            aria-label="Попередній слайд"
                            onClick={goToPrevSlide}
                        >
                            <img
                                src="/icons/arrow-left.svg"
                                alt=""
                                aria-hidden="true"
                            />
                        </button>
                        <button
                            type="button"
                            className="vaccination-standards-carousel__arrow vaccination-standards-carousel__arrow--next"
                            aria-label="Наступний слайд"
                            onClick={goToNextSlide}
                        >
                            <img
                                src="/icons/arrow-right.svg"
                                alt=""
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>

                <div
                    className="vaccination-standards-carousel__viewport"
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                >
                    <Swiper
                        className="vaccination-standards-carousel__swiper"
                        modules={[Autoplay, Keyboard]}
                        loop={slides.length > 1}
                        loopPreventsSliding={false}
                        slidesPerView={1}
                        spaceBetween={0}
                        speed={transitionSpeed}
                        keyboard={{
                            enabled: true,
                            onlyInViewport: true,
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                            waitForTransition: false,
                        }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                    >
                        {slides.map((slide, index) => (
                            <SwiperSlide
                                className="vaccination-standards-carousel__slide"
                                key={slide.title}
                            >
                                <article className="vaccination-standards-carousel__slide-inner">
                                    <div className="vaccination-standards-carousel__text-card">
                                        <h3>{slide.title}</h3>
                                        <p>{slide.text}</p>
                                    </div>

                                    <figure className="vaccination-standards-carousel__image-card">
                                        <WebPImage
                                            src={slide.image}
                                            alt={`${slide.title} — вакцинація у медичному центрі Для Людей, Дніпро`}
                                            loading={index === 0 ? "eager" : "lazy"}
                                            fetchpriority={
                                                index === 0 ? "high" : "auto"
                                            }
                                            decoding="async"
                                        />
                                    </figure>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
