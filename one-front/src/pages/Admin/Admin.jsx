import { useEffect, useRef, useState } from 'react';
import './Admin.scss';
import axios from 'axios';

export const Admin = () => {
	const [addImg, setAddImg] = useState(null);
	const [swiperImg, setSwiperImg] = useState([]);
	const [dateCh, setDateCh] = useState(new Date().toISOString().slice(0, 10));
	const [dateKg, setDateKg] = useState(new Date().toISOString().slice(0, 10));

	// gallery part
	// Get images
	const getSwiperImg = async () => {
		try {
			const resp = await axios(`${process.env.REACT_APP_API_URL}/uploads`);
			setSwiperImg(resp.data);
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	};

	useEffect(() => {
		getSwiperImg();
	}, []);
	// Download images
	const saveImg = async () => {
		try {
			const headers = {
				'Content-Type': 'multipart/form-data',
				Authorization: localStorage.getItem('token'),
			};
			const formData = {
				file: addImg,
			};
			const send = await axios.post(
				`${process.env.REACT_APP_API_URL}/uploads`,
				formData,
				{
					headers: headers,
				}
			);
			console.log(send);
			getSwiperImg();
		} catch (error) {
			console.error('Error', error);
		}
	};
	// delete images
	const deleteImg = async (id) => {
		try {
			const headers = {
				Authorization: localStorage.getItem('token'),
			};
			const deleteImages = await axios.delete(
				`${process.env.REACT_APP_API_URL}/uploads/${id}`,
				{
					headers: headers,
				}
			);
			console.log(deleteImages);
			getSwiperImg();
		} catch (error) {
			console.error('Error', error);
		}
	};

	//  excel part
	// FOR KYRGYZSTAN \/
	const excelKg = useRef(null);
	const handleFileChangeKg = (e) => {
		if (e.target.files.length > 0) {
			excelKg.current = e.target.files[0];
			console.log('file save', excelKg.current);
		}
	};
	// FORE CHINA \/
	const excelCh = useRef(null);
	const handleFileChangeCn = (e) => {
		if (e.target.files.length > 0) {
			excelCh.current = e.target.files[0];
			console.log('file save', excelCh.current);
		}
	};

	return (
		<section className='admin'>
			<div className='admin__container'>
				<h2 className='admin__title'>Панель администрации</h2>
				<div className='admin__gallery gallery'>
					<div className='gallery__top'>
						<h3 className='gallery__title'>Фотографии в карусели</h3>
						<div className='gallery__inputs-wrapper'>
							<label className='gallery__label' htmlFor=''>
								Можно выбрать только один файл
							</label>
							<input
								className='gallery__download'
								type='file'
								placeholder='Загрузить фото'
								onInput={(e) => {
									e.preventDefault();
									setAddImg(e.target.files[0]);
								}}
							/>
						</div>
					</div>
					<div className='gallery__wrapper'>
						<ul className='gallery__list'>
							{swiperImg.map((el) => (
								<li className='gallery__items' key={el.id}>
									<div className='gallery__img-wrapper'>
										<img
											className='gallery__img'
											src={`${process.env.REACT_APP_API_URL}/uploads/${el.id}/download`}
											alt=''
										/>
									</div>
									<button
										className='gallery__delete'
										onClick={() => {
											deleteImg(el.id);
										}}>
										<svg
											width='22'
											height='26'
											viewBox='0 0 22 26'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'>
											<path
												fillRule='evenodd'
												clipRule='evenodd'
												d='M15.8889 0H6.11111V5.2H0V7.8H22V5.2H15.8889V0ZM13.4444 5.2H8.55556V2.6H13.4444V5.2Z'
												fill='#E40505'
											/>
											<path
												fillRule='evenodd'
												clipRule='evenodd'
												d='M2.52855 26L1.48093 10.4H20.5189L19.4713 26H2.52855ZM9.77778 23.4V13H7.33333V23.4H9.77778ZM12.2222 23.4V13H14.6667V23.4H12.2222Z'
												fill='#E40505'
											/>
										</svg>
									</button>
								</li>
							))}
						</ul>
						<button className='gallery__save' onClick={saveImg}>
							Сохранить
						</button>
					</div>
				</div>
				<ul className='admin__files files'>
					<li className='files__items'>
						<h4 className='files__title'>Выгрузить файл Excel: Китай </h4>
						<div className='files__input-wrapper'>
							<input
								className='files__input'
								id='file-ch'
								type='file'
								placeholder='Выбрать файл'
								onInput={handleFileChangeCn}
							/>
							<label className='files__label' htmlFor='file-ch'></label>
						</div>
						<div className='files__input-wrapper'>
							<label className='files__label' htmlFor='date-ch'>
								Выберите дату поступления товаров
							</label>
							<input
								className='files__input'
								id='date-ch'
								type='date'
								value={dateCh}
								onInput={(e) => {
									setDateCh(e.target.value);
								}}
							/>
						</div>
						<button
							className='files__btn files__btn--black'
							onClick={async () => {
								if (excelCh.current) {
									try {
										console.log('отправка Китай отработала');
										const formdata = new FormData();
										formdata.append('file', excelCh.current);
										const response = await axios.post(
											`${
												process.env.REACT_APP_API_URL
											}/product/add/cn/1/${dateCh
												.split('-')
												.reverse()
												.join('-')}`,
											formdata,
											{
												headers: {
													'Content-Type': 'multipart/form-data',
												},
											}
										);
										console.log(response);
										alert('Данные добавлены');
									} catch (err) {
										alert('Ошибка отправки данных', err);
									}
								}
							}}>
							Отправить
						</button>
					</li>
					<li className='files__items'>
						<h4 className='files__title'>Выгрузить файл Excel: Бишкек </h4>
						<div className='files__input-wrapper'>
							<input
								className='files__input'
								type='file'
								placeholder='Выбрать файл'
								onInput={handleFileChangeKg}
							/>
							<label className='files__label' htmlFor='#'></label>
						</div>
						<div className='files__input-wrapper'>
							<label className='files__label' htmlFor='date-kg'>
								Выберите дату поступления товаров
							</label>
							<input
								className='files__input'
								id='date-kg'
								type='date'
								value={dateKg}
								onInput={(e) => {
									setDateKg(e.target.value);
								}}
							/>
						</div>
						<button
							className='files__btn'
							onClick={async () => {
								if (excelKg.current) {
									try {
										console.log('отправка Бишкек отработала');
										const formdata = new FormData();
										formdata.append('file', excelKg.current);
										const response = await axios.post(
											`${
												process.env.REACT_APP_API_URL
											}/product/add/kg/1/${dateKg
												.split('-')
												.reverse()
												.join('-')}`,
											formdata,
											{
												headers: {
													'Content-Type': 'multipart/form-data',
												},
											}
										);
										console.log(response);
										alert('Данные добавлены');
									} catch (err) {
										alert('Ошибка при отправке данных', err);
									}
								}
							}}>
							Отправить
						</button>
					</li>
					<li className='files__items'>
						<h4 className='files__title'>
							Получить файл Excel: Список клиентов
						</h4>
						<button
							className='files__btn files__btn--yellow'
							onClick={() => {
								axios(`${process.env.REACT_APP_API_URL}/users/shop/1`, {
									method: 'GET',
									responseType: 'blob',
								})
									.then((response) => {
										const url = window.URL.createObjectURL(
											new Blob([response.data])
										);
										const link = document.createElement('a');
										link.href = url;
										link.setAttribute('download', `users.xlsx`); // Имя файла, которое вы установили в бэкенде
										document.body.appendChild(link);
										link.click();
										// Очистка
										document.body.removeChild(link);
										window.URL.revokeObjectURL(url);
									})
									.catch((error) => {
										console.error('Ошибка при скачивании файла:', error);
									});
							}}>
							Загрузить
						</button>
					</li>
				</ul>
			</div>
		</section>
	);
};
