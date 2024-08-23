import './Information.scss';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export const Information = ({ personalcode }) => {
	const handleCopyAddress = (text) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				console.log(`Текст скопирован: ${text}`);
			})
			.catch((error) => {
				console.error('Ошибка при копировании текста:', error);
			});
	};

	const handleCopyCustomText = (idPrefix) => {
		const t1 = document.querySelector(`#${idPrefix}1`);
		const t2 = document.querySelector(`#${idPrefix}2`);
		const t3 = document.querySelector(`#${idPrefix}3`);
		const t4 = document.querySelector(`#${idPrefix}4`);

		if (t1 && t2 && t3 && t4) {
			const text = `1: ${t1.innerText}\n2: ${t2.innerText}\n3: ${t3.innerText}\n4: ${t4.innerText}`;
			handleCopyAddress(text);
		} else {
			console.error('One of the elements is null.');
		}
	};

	return (
		<section className='information'>
			<div className='information__container'>
				<div className='information__top'>
					<h2 className='information__title'>Полезная информация</h2>
					<span className='information__subtitle'>
						Образцы заполнения склада в Китае
					</span>
				</div>
				<div className='information__wrapper tabs'>
					<Tabs>
						<TabList>
							<Tab>Taobao</Tab>
							<Tab>1688</Tab>
							<Tab>Poizon</Tab>
							<Tab>Pinduoduo</Tab>
						</TabList>
						<TabPanel>
							<ol className='tabs__list'>
								<li id='taobao1' className='tabs__items'>
									<p className='tabs__text'>崔女士One-{personalcode}</p>
								</li>
								<li id='taobao2' className='tabs__items'>
									<p className='tabs__text'>13268366928</p>
								</li>
								<li id='taobao3' className='tabs__items'>
									<p className='tabs__text'>广东省 广州市 白云区 石井街道</p>
								</li>
								<li id='taobao4' className='tabs__items'>
									<p className='tabs__text'>
										凤鸣路新宇物流928库B8档快递部 One-{personalcode}
									</p>
								</li>
							</ol>
							<a className='tabs__link' href='#'>
								Полезная ссылка
							</a>
							<button
								className='tabs__btn'
								onClick={() => handleCopyCustomText('taobao')}>
								Скопировать
							</button>
						</TabPanel>
						<TabPanel>
							<ol className='tabs__list'>
								<li id='16881' className='tabs__items'>
									<p className='tabs__text'>崔女士One-{personalcode}</p>
								</li>
								<li id='16882' className='tabs__items'>
									<p className='tabs__text'>13268366928</p>
								</li>
								<li id='16883' className='tabs__items'>
									<p className='tabs__text'>广东省 广州市 白云区 石井街道</p>
								</li>
								<li id='16884' className='tabs__items'>
									<p className='tabs__text'>
										凤鸣路新宇物流928库B8档快递部 One-{personalcode}
									</p>
								</li>
							</ol>
							<a className='tabs__link' href='#'>
								Полезная ссылка
							</a>
							<button
								className='tabs__btn'
								onClick={() => handleCopyCustomText('1688')}>
								Скопировать
							</button>
						</TabPanel>
						<TabPanel>
							<ol className='tabs__list'>
								<li id='Poizon1' className='tabs__items'>
									<p className='tabs__text'>崔女士One-{personalcode}</p>
								</li>
								<li id='Poizon2' className='tabs__items'>
									<p className='tabs__text'>13268366928</p>
								</li>
								<li id='Poizon3' className='tabs__items'>
									<p className='tabs__text'>广东省 广州市 白云区 石井街道</p>
								</li>
								<li id='Poizon4' className='tabs__items'>
									<p className='tabs__text'>
										凤鸣路新宇物流928库B8档快递部 One-{personalcode}
									</p>
								</li>
							</ol>
							<a className='tabs__link' href='#'>
								Полезная ссылка
							</a>
							<button
								className='tabs__btn'
								onClick={() => handleCopyCustomText('Poizon')}>
								Скопировать
							</button>
						</TabPanel>
						<TabPanel>
							<ol className='tabs__list'>
								<li id='Pinduoduo1' className='tabs__items'>
									<p className='tabs__text'>崔女士One-{personalcode}</p>
								</li>
								<li id='Pinduoduo2' className='tabs__items'>
									<p className='tabs__text'>13268366928</p>
								</li>
								<li id='Pinduoduo3' className='tabs__items'>
									<p className='tabs__text'>广东省 广州市 白云区</p>
								</li>
								<li id='Pinduoduo4' className='tabs__items'>
									<p className='tabs__text'>
										凤鸣路新宇物流928库B8档快递部 One-{personalcode}
									</p>
								</li>
							</ol>
							<a className='tabs__link' href='#'>
								Полезная ссылка
							</a>
							<button
								className='tabs__btn'
								onClick={() => handleCopyCustomText('Pinduoduo')}>
								Скопировать
							</button>
						</TabPanel>
					</Tabs>
				</div>
			</div>
		</section>
	);
};
