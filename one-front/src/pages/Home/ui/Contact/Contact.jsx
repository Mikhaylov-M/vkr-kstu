import './Contact.scss'
import { useState, useEffect } from 'react';
import whatsApp from '../../../../global/images/whatsApp-icon.svg'
import whiteWhatsApp from '../../../../global/images/white-whatsApp-icon.svg'
import yellowArrow from '../../../../global/images/yellow-arrow.svg'
import { Map } from '../Map'

export const Contact = () => {
  // Down here, function that changes "text" in "Contact__graph-title"
  // in mobile version
  const [graph, setGraph] = useState('');
  const changeGraph = () => {
    setGraph(window.innerWidth > 768 ? 'Понедельник - Суббота' : "Пон - Субб");
  };
  useEffect(() => {
    changeGraph();
    const handleResize = () => {
      changeGraph();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return(
    <section className="contact" id='contact'>
      <div className="contact__container">
        <div className="contact__wrapper">
          <h2 className="contact__title">Контакты</h2>
          <div className="contact__inner">
            <div className="contact__columns">
              <h3 className='contact__city'>Бишкек</h3>
              <span className='contact__address'>пр. Чуй 119/1</span>
              <a className="contact__address-link" href="#map">
                Как добраться?
                <span>
                  <img src={yellowArrow} alt="" />
                </span>
              </a> 
            </div>
            <ul className="contact__columns">
              <li className="contact__graph">
                <span className="contact__graph-title">{graph}</span>
                <span className="contact__graph-text">10:00 - 18:00</span>
              </li>
              <li className="contact__graph">
                <span className="contact__graph-title">Воскресенье</span>
                <span className="contact__graph-text">Выходной</span>
              </li>
            </ul>
          </div>
          <ul className="contact__social social">
            <li className="social__columns">
              <h4 className="social__title">Отдел поиска и выкупа товаров</h4>
              <a className="social__links social__links--yellow" href='https://api.whatsapp.com/send/?phone=996555333883&text&type=phone_number' target='_blank' rel="noreferrer">
                <span className="social__links-icon">
                  <img src={whatsApp} alt="" />
                </span>
                <span className="social__links-text">+996 555 33 38 83</span>
              </a>
            </li>
            <li className="social__columns">
              <h4 className="social__title">Служба поддержки клиентов</h4>
              <a className="social__links social__links--gray" href='https://api.whatsapp.com/send/?phone=996777333883&text&type=phone_number' target='_blank' rel="noreferrer">
                <span className="social__links-icon">
                  <img src={whatsApp} alt="" />
                </span>
                <span className="social__links-text">+996 777 33 38 83</span>
              </a>
            </li>
            <li className="social__columns">
              <h4 className="social__title">Крупногабаритные товары</h4>
              <a className="social__links social__links--black" href='https://api.whatsapp.com/send/?phone=996707333883&text&type=phone_number' target='_blank' rel="noreferrer">
                <span className="social__links-icon">
                  <img src={whiteWhatsApp} alt="" />
                </span>
                <span className="social__links-text">+996 707 33 38 83</span>
              </a>
            </li>
          </ul>
          <Map />
        </div>
      </div>
    </section>
  )
}