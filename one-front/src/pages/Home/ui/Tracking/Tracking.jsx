import { useState, useEffect } from "react";
import "./Tracking.scss";
import axios from "axios";

export const Tracking = () => {

  const [data, setData] = useState(null)
  const [search, setSearch] = useState("")
  const [trackingArray, setTrackingArray] = useState(JSON.parse(localStorage.getItem('tracking')) || [])

  // Down here, function that changes "text" in button to "svg" 
  // in mobile version, in "FORM"
  const [searchIcon, setSearchIcon] = useState('');
  const changeSearchIcon = () => {
    setSearchIcon(window.innerWidth > 768 ? 'Отследить' : (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7.83762 0C3.50902 0 0 3.50905 0 7.83768C0 12.1663 3.50902 15.6754 7.83762 15.6754C9.64884 15.6754 11.3166 15.061 12.6438 14.0292L18.6145 20L20 18.6145L14.0293 12.6437C15.0609 11.3165 15.6752 9.64884 15.6752 7.83768C15.6752 3.50905 12.1662 0 7.83762 0ZM1.9594 7.83768C1.9594 4.59121 4.59117 1.95942 7.83762 1.95942C11.0841 1.95942 13.7158 4.59121 13.7158 7.83768C13.7158 11.0841 11.0841 13.7159 7.83762 13.7159C4.59117 13.7159 1.9594 11.0841 1.9594 7.83768Z" fill="#ECECEC" />
      </svg>
    ));
  };

  const datePlusOne = (dateStr) => {
    const newDate = new Date(dateStr)
    newDate.setDate(newDate.getDate() + 1)
    return newDate.toISOString()
  }
  useEffect(() => {
    changeSearchIcon();
    const handleResize = () => {
      changeSearchIcon();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('tracking', JSON.stringify(trackingArray))
    console.log('изменился');
  }, [trackingArray])

  return (
    <section className="tracking" id="tracking">
      <div className="tracking__container">
        <div className="tracking__title-wrapper">
          <h2 className="tracking__title">Отслеживание товара</h2>
          <div className="tracking__title-line" />
        </div>
        <form className="tracking__form">
          <input
            type="text"
            id="tracking__input"
            className="tracking__input"
            placeholder="JT5656565656"
            value={search}
            onInput={(e) => {
              setSearch(e.target.value)
            }}
          />
          <button className="tracking__btn" type="submit"
            onClick={async (e) => {
              e.preventDefault()
              setTrackingArray([...new Set([search, ...trackingArray])])
              const response = await axios(`${process.env.REACT_APP_API_URL}/product/track/` + search)

              console.log(response)

              setData(response.data)

              setSearch('')
            }}
          >{searchIcon}</button>
        </form>
        <div className="tracking__selected selected">
          {trackingArray?.map((el, idx) => (
            <div className="selected__item" key={idx} onClick={() => {
              setSearch(el)
            }}>
              <p className="selected__item-name">{el}</p>
              <button className="selected__delete-item" onClick={(e) => {
                e.stopPropagation()
                console.log('удаление')
                setTrackingArray(prev => prev.filter((el, i) => i !== idx))
              }}></button>
            </div>
          ))}
        </div>
        {data &&
          <div className="tracking__info">
            <div className="tracking__status status">
              <ul className="status__list">
                <li className="status__item">
                  <span>дата</span> <span>статус</span>
                </li>
                {
                  data?.status === "in_storage" &&
                  <li className="status__item">
                    <span className="status__date">{data?.dateCreated.slice(0, 16).split("T")[0].split("-").reverse().join(".")}</span>
                    <span className="status__dot" />
                    <span className="status__location">Поступил на склад в Китае</span>
                  </li>
                }
                {
                  data?.status === "on_the_way" &&
                  <>
                  <li className="status__item">
                    <span className="status__date">{data?.dateCreated.slice(0, 16).split("T")[0].split("-").reverse().join(".")}</span>
                    <span className="status__dot" />
                    <span className="status__location">Поступил на склад в Китае</span>
                  </li>
                  <li className="status__item">
                    <span className="status__date">{datePlusOne(data?.dateCreated).slice(0, 16).split("T")[0].split("-").reverse().join(".")}</span>
                    <span className="status__dot" />
                    <span className="status__location">Отправлено в Бишкек</span>
                  </li>
                  </>
                }
                {
                  data?.status === "delivered" &&
                  <>
                  <li className="status__item">
                    <span className="status__date">{data?.dateCreated.slice(0, 16).split("T")[0].split("-").reverse().join(".")}</span>
                    <span className="status__dot" />
                    <span className="status__location">Поступил на склад в Китае</span>
                  </li>
                  <li className="status__item">
                    <span className="status__date">{
                    datePlusOne(data?.dateCreated).slice(0, 16).split("T")[0].split("-")
                    .reverse().join(".")
                    }</span>
                    <span className="status__dot" />
                    <span className="status__location">Отправлено в Бишкек</span>
                  </li>
                  <li className="status__item">
                    <span className="status__date">{data?.dateUpdated.slice(0, 16).split("T")[0].split("-").reverse().join(".")}</span>
                    <span className="status__dot" />
                    <span className="status__location">Поступил в Бишкек</span>
                  </li>
                  </>
                }
              </ul>
            </div>
            <div className="tracking__personal personal">
              <ul className="personal__list">
                <li className="personal__item">
                  <span>персональный код</span>
                  <span>трек код</span>
                </li>
                <li className="personal__item">
                  <span className="personal__pers-code">{data?.userCode}</span>
                  <span className="personal__track-code">{data?.trackCodeOfTheProduct}</span>
                </li>
              </ul>
            </div>
          </div>
        }
      </div>
    </section>
  )
}