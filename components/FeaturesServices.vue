
<template>
    <section class="featuredservices">

        <div class="saidAbout">
            <h2>Featured Services</h2>
            <p class="description">Swipe through the series of available providers.</p>
  
            <div class="testimonialD">
                <Swiper
                    :modules="[Navigation, Pagination, Autoplay]"
                    :slides-per-view="1"
                    :space-between="10"
                    :loop="true"
                    :autoplay="{ delay: 3000, disableOnInteraction: false }"
                    :pagination="{ clickable: false }"
                    :navigation="false"
                    class="my-swiper"
                    >
                        <SwiperSlide>
                            <img src="/public/img/mechanic.jpeg" alt="Slide Image" class="swiper-image" />
                            <div class="details">
                                <h3>Mechanic</h3>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/public/img/plumber.jpeg" alt="Slide Image" class="swiper-image" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/public/img/hairdresser.jpeg" alt="Slide Image" class="swiper-image" /><div class="details">
                                <h3>Hairdresser</h3>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/public/img/tailor.jpeg" alt="Slide Image" class="swiper-image" />
                            <div class="details">
                                <h3>Tailor</h3>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/public/img/taxi.jpeg" alt="Slide Image" class="swiper-image" />
                            <div class="details">
                                <h3>Taxi</h3>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/public/img/welder.jpeg" alt="Slide Image" class="swiper-image" />
                            <div class="details">
                                <h3>Welder</h3>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/public/img/vulcanizer.jpeg" alt="Slide Image" class="swiper-image" />
                            <div class="details">
                                <h3>Vulcanizer</h3>
                            </div>
                        </SwiperSlide>
                    </Swiper>
            </div>
        </div>
    </section>
</template>
<script setup>
    import { Carousel, Slide } from 'vue3-carousel';
    import 'vue3-carousel/dist/carousel.css';

    import { Swiper, SwiperSlide } from "swiper/vue";
    import { Navigation, Pagination, Autoplay } from "swiper/modules";

</script>
<style scoped>
  p {
    color: #666;
    margin: 5px;
  }

.details {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    color: #007bff;
  }
.testi{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    margin: 10px;
}
    img{
        width: 400px;
        height: 400px;
        border-radius: 10px;
    }
    .featuredservices{
        margin-top: -100px;
        padding: 80px 20px;
        background: #f8f9fa;
        text-align: center;
    }
    :deep(.swiper-pagination) {
  display: none !important;
}

</style>




















