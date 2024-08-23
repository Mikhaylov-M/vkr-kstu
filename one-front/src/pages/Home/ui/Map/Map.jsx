import React from 'react';
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	ZoomControl,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapWithMarker.scss';
import markerIcon from '../../../../global/images/mark.svg';
import { Link } from 'react-router-dom';

export const Map = () => {
	const position = [42.875598, 74.626221]; // Координаты места

	// Создаем иконку маркера
	const customMarkerIcon = L.icon({
		iconUrl: markerIcon,
		iconSize: [32, 32],
		iconAnchor: [16, 32],
	});

	return (
		<section className='map' id='map'>
			<MapContainer
				center={position}
				zoom={25}
				zoomControl={false}
				style={{ height: '300px' }}>
				<TileLayer
					url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png
'
				/>
				<Marker position={position} icon={customMarkerIcon}>
					<Popup>
						<div>
							<h3>ONEexpress.kg</h3>
							<p>Сегодня c 10:00 до 18:00</p>
							<p>
								Адресс: Проспект Чуй, 119/1 Свердловский район, Бишкек, 720065
							</p>
							<Link to='https://2gis.kg/bishkek/firm/70000001082898821?m=74.626221%2C42.875598%2F16'>
								2GIS
							</Link>
							<span> </span>
							<Link to='https://yandex.ru/maps/10309/bishkek/house/Y00YcAVmS0IBQFpofXR2dHpmbQ==/?ll=74.626527%2C42.875447&z=19.74'>
								Yandex
							</Link>
						</div>
					</Popup>
				</Marker>
				<ZoomControl position='bottomleft' className='large-zoom-control' />
			</MapContainer>
		</section>
	);
};
