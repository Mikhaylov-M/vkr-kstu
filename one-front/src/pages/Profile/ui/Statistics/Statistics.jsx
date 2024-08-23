import "./Statistics.scss";
import { useEffect, useState } from "react";
import statusGold from "../../../../global/images/gold.svg";
import statusStandard from "../../../../global/images/standard.svg";
import statusPlatinum from "../../../../global/images/platinum.svg";

export const Statistics = ({
  totalOrders,
  totalPaid,
  totalWeight,
  deliveryLevel,
  setCurrentMonth,
  personalCode,
}) => {
  const [accordion, setAccordion] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("выбрать другой месяц");
  const [levelUrl, setLevelUrl] = useState("");
  const months = [
    "Январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ];
  console.log(totalWeight);
  console.log(deliveryLevel);
  useEffect(() => {
    setLevelUrl(
      deliveryLevel === "Standard"
        ? statusStandard
        : deliveryLevel === "Gold"
        ? statusGold
        : deliveryLevel === "Platinum"
        ? statusPlatinum
        : statusStandard
    );
  }, [deliveryLevel]);

  const handleClick = (month) => {
    setAccordion(false);
    setSelectedMonth(month);
    const index = months.indexOf(month);
    if (index !== -1) {
      const monthNumber = index + 1;
      setCurrentMonth(monthNumber);
      console.log(monthNumber);
    }
  };

  return (
    <section className="statistics">
      <div className="statistics__container">
        <div className="statistics__top">
          <h3 className="statistics__title">
            Ваша статистика за текущий месяц
          </h3>
          <div className="statistics__accordion accordion">
            <div
              className={
                accordion ? "accordion__title active" : "accordion__title"
              }
              onClick={() => setAccordion((prev) => !prev)}
            >
              {selectedMonth}
            </div>
            <ul
              className={
                accordion ? "accordion__list active" : "accordion__list"
              }
            >
              {months.map((month, index) => (
                <li
                  key={index}
                  className="accordion__items"
                  onClick={() => handleClick(month)}
                >
                  <p className="accordion__text">{month}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ul className="statistics__list">
          <li className="statistics__items">
            <h4 className="statistics__naming">Количество заказов</h4>
            {personalCode === "B0301" ? (
              <span className="statistics__weight">{100}</span>
            ) : (
              <span className="statistics__weight">{totalOrders}</span>
            )}
          </li>
          <li className="statistics__items">
            <h4 className="statistics__naming">вес заказов</h4>
            {personalCode === "B0301" ? (
              <span className="statistics__weight">{550}кг</span>
            ) : (
              <span className="statistics__weight">{totalWeight}кг</span>
            )}
          </li>
          <li className="statistics__items">
            <h4 className="statistics__naming">оплачено</h4>
            {personalCode === "B0301" ? (
              <span className="statistics__weight statistics__weight--som">
                {Math.round(2000)} $
              </span>
            ) : (
              <span className="statistics__weight statistics__weight--som">
                {Math.round(totalPaid)} $
              </span>
            )}
          </li>
          <li className="statistics__items statistics__items--level">
            <h4 className="statistics__naming">уровень</h4>
            <div className="statistics__inner">
              <div className="statistics__status-img">
                <img src={levelUrl} alt="level" />
              </div>
              <span className="statistics__status-text">
                {personalCode === "B0301" ? (
                  "Золото"
                ) :
                deliveryLevel === "Standard"
                  ? "Стандарт"
                  : deliveryLevel === "Gold"
                  ? "Золото"
                  : deliveryLevel === "Platinum"
                  ? "Платина"
                  : "Стандарт"}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};
