import React, { useState, useEffect } from 'react';
import './Calculator.scss';
import CustomInputCalculator from '../../../../global/components/CustomInputCalculator';

export const Calculator = () => {
	const [width, setWidth] = useState('');
	const [length, setLength] = useState('');
	const [height, setHeight] = useState('');
	const [quantity, setQuantity] = useState('');
	const [price, setPrice] = useState('');
	const [weight, setWeight] = useState('');
	const [volume, setVolume] = useState('');
	const [volume2, setVolume2] = useState('');
	const [totalPrice, setTotalPrice] = useState(0);
	const [density, setDensity] = useState('');
	const [mode, setMode] = useState('cargo');

	useEffect(() => {
		if (mode === 'cargo') {
			const newVolume = (width * length * height) / 1000000;
			const newTotalPrice = newVolume * quantity * price;

			setVolume((newVolume * quantity).toFixed(2));
			setTotalPrice(newTotalPrice.toFixed(2));
			setDensity('');
		} else if (mode === 'density') {
			if (volume2 !== 0 && weight !== '') {
				const newDensity = weight / volume2;
				setDensity(newDensity.toFixed(2));
				setTotalPrice('');
			}
		}
	}, [width, length, height, quantity, price, weight, volume, mode, volume2]);

	return (
		<section className='calculator' id='calculator'>
			<div className='calculator__container'>
				<div className='calculator__wrapper'>
					<div className='calculator__title_1'>
						<h1 className='calculator__main-title'>Калькулятор</h1>
					</div>
					<div className='calculator__title-container'>
						<div
							className={`calculator__title ${
								mode === 'cargo' ? 'calculator__title--active' : ''
							}`}
							onClick={() => setMode('cargo')}>
							<h2>Объем груза (м3)</h2>
						</div>
						<div
							className={`calculator__title ${
								mode === 'density' ? 'calculator__title--active' : ''
							}`}
							onClick={() => setMode('density')}>
							<h2>Объем плотности (p)</h2>
						</div>
					</div>
					<div className='calculator__section'>
						{mode === 'cargo' ? (
							<>
								<CustomInputCalculator
									value={width}
									onChange={setWidth}
									placeholder='Ширина, см'
								/>
								<CustomInputCalculator
									value={length}
									onChange={setLength}
									placeholder='Длина, см'
								/>
								<CustomInputCalculator
									value={height}
									onChange={setHeight}
									placeholder='Высота, см'
								/>
								<CustomInputCalculator
									value={quantity}
									onChange={setQuantity}
									placeholder='Количество'
								/>
								<CustomInputCalculator
									value={price}
									onChange={setPrice}
									placeholder='Цена'
								/>
							</>
						) : (
							<>
								<CustomInputCalculator
									value={weight}
									onChange={setWeight}
									placeholder='Вес груза, кг'
								/>
								<CustomInputCalculator
									value={volume2}
									onChange={setVolume2}
									placeholder='Объем груза, м3'
								/>
							</>
						)}
						<div className='calculator__result'>
							{mode === 'cargo' ? (
								<div className='calculator__result'>
									<div className='calculator__xz'>
										<p>{volume} м3</p>
									</div>
									<div className='calculator__xz'>
										<p>{totalPrice} $</p>
									</div>
								</div>
							) : (
								<div className='calculator__xz'>
									<p>{density} кг/м3</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Calculator;
