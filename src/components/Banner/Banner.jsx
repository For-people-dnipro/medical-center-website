import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Banner.css";

export default function Banner() {
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        fetch("http://localhost:1337/api/home-sliders?populate=*")
            .then((res) => res.json())
            .then((data) => {
                const items = Array.isArray(data?.data) ? data.data : [];
                const sorted = items
                    .slice()
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
                setSlides(sorted);
            })
            .catch((err) => {
                console.error("Failed to load home-sliders:", err);
                setSlides([]);
            });
    }, []);

    return (
        <div className="banner-container">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, Keyboard]}
                loop={true}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                }}
                speed={900}
                navigation={{
                    nextEl: ".banner-arrow-right",
                    prevEl: ".banner-arrow-left",
                }}
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
                slidesPerView={1}
                allowTouchMove={true}
            >
                <button className="banner-arrow banner-arrow-left">
                    <img src="/icons/arrow-left.svg" alt="prev" />
                </button>

                <button className="banner-arrow banner-arrow-right">
                    <img src="/icons/arrow-right.svg" alt="next" />
                </button>

                {slides.map((slide) => {
                    const imageUrl = slide.photo?.url
                        ? `http://localhost:1337${slide.photo.url}`
                        : null;

                    return (
                        <SwiperSlide key={slide.id}>
                            <div className="banner-slide">
                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt="banner"
                                        className="banner-image"
                                    />
                                )}
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}
