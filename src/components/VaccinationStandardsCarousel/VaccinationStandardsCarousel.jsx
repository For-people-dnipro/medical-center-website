import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
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
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const swiperRef = useRef(null);

    const handleKeyDown = (event) => {
        if (!swiperRef.current) {
            return;
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            swiperRef.current.slidePrev();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            swiperRef.current.slideNext();
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
                    </h2>

                    <div className="vaccination-standards-carousel__controls">
                        <button
                            type="button"
                            className="vaccination-standards-carousel__arrow vaccination-standards-carousel__arrow--prev"
                            aria-label="Previous slide"
                            ref={prevRef}
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
                            aria-label="Next slide"
                            ref={nextRef}
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
                        modules={[Navigation, Autoplay]}
                        loop={slides.length > 1}
                        slidesPerView={1}
                        spaceBetween={0}
                        speed={650}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        onInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;

                            swiper.navigation.destroy();
                            swiper.navigation.init();
                            swiper.navigation.update();
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
                                        <img
                                            src={slide.image}
                                            alt={`${slide.title} — вакцинація у медичному центрі Для Людей, Дніпро`}
                                            loading={index === 0 ? "eager" : "lazy"}
                                            fetchPriority={
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
