import './Level.scss';
import standard from '../../../../global/images/standard.svg';
import gold from '../../../../global/images/gold.svg';
import platinum from '../../../../global/images/platinum.svg';
export const Level = ({ deliveryLevel, totalWeight, personalCode }) => {
  if (personalCode === 'B0301') {
    totalWeight = 550
    deliveryLevel = "Gold"
  }
	const progressPercent = (totalWeight / 1000) * 100;
	return (
		<section className='level'>
			<div className='level__container'>
				<div className='level__top'>
					<h2 className='level__title'>
						Повышайте свой уровень и получайте бонусы
					</h2>
					<span className='level__warning'>
						*уровень сбрасывается каждые 3 месяца
					</span>
				</div>
				<ul className='level__wrapper'>
					<li className='level__rows level__rows--images'>
						<div
							className='level__points'
							style={deliveryLevel === 'Standard' ? { opacity: '1' } : {}}>
							<img className='level__img' src={standard} alt='' />
						</div>
						<div
							className='level__points'
							style={deliveryLevel === 'Gold' ? { opacity: '1' } : {}}>
							<img className='level__img' src={gold} alt='' />
						</div>
						<div
							className='level__points'
							style={deliveryLevel === 'Platinum' ? { opacity: '1' } : {}}>
							<img className='level__img' src={platinum} alt='' />
						</div>
					</li>

					<li className='level__progress progress'>
						<span
							className='progress__inner'
							style={{ width: `${progressPercent}%` }}>
							{totalWeight} кг
						</span>
					</li>

					<li className='level__rows level__rows--areas'>
						<div className='level__text-wrapper'>
							<span className='level__status'>Стандарт</span>
							<span className='level__area'>1 кг - 3.7$</span>
						</div>
						<div className='level__text-wrapper'>
							<span className='level__status'>Золото</span>
							<span className='level__area'>500 кг - 3.5$</span>
						</div>
						<div className='level__text-wrapper'>
							<span className='level__status'>Платина</span>
							<span className='level__area'>1000 кг - 3.3$</span>
						</div>
					</li>
				</ul>
			</div>
		</section>
	);
};
