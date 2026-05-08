import { useEffect, useRef } from "react";
import Button from "../Button/Button";
import DoctorCard from "../DoctorCard/DoctorCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./RelatedDoctorsSection.css";

export default function RelatedDoctorsSection({
    doctors = [],
    branchAddress = "",
    title = "ЛІКАРІ",
    allDoctorsHref = "/doctors",
    allDoctorsLabel = "Наша команда",
    className = "",
}) {
    const desktopItems = doctors.slice(0, 4);
    const mobileItems = doctors;
    const hasMobileCarousel = mobileItems.length > 1;
    const canLoopMobileCarousel = mobileItems.length > 2;
    const mobileSwiperRef = useRef(null);

    useEffect(() => {
        if (!hasMobileCarousel) return undefined;

        const intervalId = window.setInterval(() => {
            const swiper = mobileSwiperRef.current;
            if (!swiper || swiper.destroyed) return;
            if (swiper.autoplay?.running) return;
            swiper.slideNext(650);
        }, 3200);

        return () => window.clearInterval(intervalId);
    }, [hasMobileCarousel, mobileItems.length]);

    if (!doctors.length) return null;

    const rootClassName = ["related-doctors", className].filter(Boolean).join(" ");
    const countClass =
        desktopItems.length < 4
            ? `related-doctors__grid--count-${desktopItems.length}`
            : "";
    const gridClassName = ["related-doctors__grid", countClass]
        .filter(Boolean)
        .join(" ");

    return (
        <section className={rootClassName}>
            <div className="related-doctors__header">
                <h2 className="related-doctors__title">{title}</h2>
                <p className="related-doctors__subtitle">
                    {branchAddress
                        ? `які приймають за адресою – ${branchAddress}`
                        : "які приймають у цій філії"}
                </p>
            </div>

            <div className={gridClassName}>
                {desktopItems.map((doctor) => (
                    <DoctorCard key={doctor.id || doctor.slug} doctor={doctor} />
                ))}
            </div>

            <div
                className={`related-doctors__mobile ${
                    hasMobileCarousel
                        ? "related-doctors__mobile--carousel"
                        : "related-doctors__mobile--single"
                }`}
            >
                <Swiper
                    modules={hasMobileCarousel ? [Autoplay] : []}
                    slidesPerView="auto"
                    centeredSlides={hasMobileCarousel}
                    spaceBetween={20}
                    loop={canLoopMobileCarousel}
                    watchOverflow={!hasMobileCarousel}
                    observer={hasMobileCarousel}
                    observeParents={hasMobileCarousel}
                    speed={650}
                    autoplay={
                        hasMobileCarousel
                            ? {
                                  delay: 3200,
                                  disableOnInteraction: false,
                                  pauseOnMouseEnter: false,
                                  waitForTransition: false,
                              }
                            : false
                    }
                    grabCursor={hasMobileCarousel}
                    allowTouchMove={hasMobileCarousel}
                    onSwiper={(swiper) => {
                        mobileSwiperRef.current = swiper;
                        if (
                            hasMobileCarousel &&
                            swiper.autoplay &&
                            !swiper.autoplay.running
                        ) {
                            swiper.autoplay.start();
                        }
                    }}
                >
                    {mobileItems.map((doctor, index) => (
                        <SwiperSlide
                            key={`${doctor.id || doctor.slug}-mobile-${index}`}
                            className="related-doctors__slide"
                        >
                            <DoctorCard doctor={doctor} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="related-doctors__actions">
                <Button href={allDoctorsHref}>{allDoctorsLabel}</Button>
            </div>
        </section>
    );
}
