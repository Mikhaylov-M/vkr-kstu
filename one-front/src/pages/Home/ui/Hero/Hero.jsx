import { Navigation, A11y, Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/navigation';
import './Hero.scss'
import axios from 'axios';
import { useEffect, useState } from 'react';

export const Hero = () => {

  const [data, setData] = useState([])

  const getData = async () => {
    try {
			const resp = await axios(`${process.env.REACT_APP_API_URL}/uploads`)
			console.log(resp.data);
			setData(resp.data)
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <section className="hero">
      <div className="hero__container">
        <h1 className="hero__title">One Express</h1>
        <h2 className="hero__subtitle">Быстрая и надежная доставка товаров с Китая </h2>
        <Swiper
          centeredSlides={true}
          modules={[Navigation, A11y, Keyboard]}
          spaceBetween={20}
          loop={true}
          slidesPerView={3}
          initialSlide={2}
          autoHeight={false}
          mousewheel
          keyboard
          navigation
          pagination={{ clickable: false }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log('slide change')}
          breakpoints={{
            768: {
              spaceBetween: 80,
            },
          }}
        >
          {data.map(el => (
            <SwiperSlide key={el.id}>
              <img src={`${process.env.REACT_APP_API_URL}/uploads/${el.id}/download`} alt="company info" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}