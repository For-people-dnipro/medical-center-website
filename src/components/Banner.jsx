import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./Banner.css";

export default function Banner() {
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        fetch("http://localhost:1337/api/home-sliders?populate=*")
            .then((res) => res.json())
            .then((data) => {
                const sorted = data.data.sort(
                    (a, b) => (a.order || 0) - (b.order || 0)
                );
                setSlides(sorted);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="banner-container">
            <Swiper
                loop
                autoplay={{ delay: 3000 }}
                spaceBetween={0}
                slidesPerView={1}
            >
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

                                {slide.showButton &&
                                    slide.buttonText &&
                                    slide.buttonLink && (
                                        <a
                                            href={slide.buttonLink}
                                            className="banner-button"
                                        >
                                            {slide.buttonText}
                                        </a>
                                    )}
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
}
