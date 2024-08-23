import { useEffect, useRef, useState } from 'react';
import { Info } from './ui/Info';
import { Statistics } from './ui/Statistics';
import { Level } from './ui/Level';
import { Information } from './ui/Information';
import axios from 'axios';

export const Profile = () => {
	const [data, setData] = useState({});
	const [userStatistics, setUserStatistics] = useState({});
	const [userStatisticsThreeMonth, setUserStatisticsThreeMonth] = useState({});

	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
	const userId = useRef('');

	const getData = async () => {
		try {
			const info = await axios(`${process.env.REACT_APP_API_URL}/users/info`, {
				headers: {
					Authorization: localStorage.getItem('token'),
				},
			});
			userId.current = info?.data?.id;
      console.log(info?.data);
			setData(info?.data);
			generateUserStatistics(userId.current);
			generateUserStatisticsForThreeMonth(userId.current);
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	};

	const generateUserStatistics = async () => {
		try {
			if (userId.current) {
				const response = await axios.get(
					`${process.env.REACT_APP_API_URL}/users/${userId.current}/statistics/${currentMonth}`,
					{
						headers: {
							Authorization: localStorage.getItem('token'),
						},
					}
				);
        console.log(response);
				setUserStatistics(response.data);
			}
		} catch (error) {
			console.error('Error fetching user statistics:', error);
		}
	};
	const generateUserStatisticsForThreeMonth = async () => {
		try {
			if (userId.current) {
				const response = await axios.get(
					`${process.env.REACT_APP_API_URL}/users/three-month/${userId.current}`,
					{
						headers: {
							Authorization: localStorage.getItem('token'),
						},
					}
				);
				console.log(response.data);
				setUserStatisticsThreeMonth(response.data);
			}
		} catch (error) {
			console.error('Error fetching user statistics:', error);
		}
	};

	useEffect(() => {
		getData();
		generateUserStatisticsForThreeMonth();
	}, []);
	useEffect(() => {
		generateUserStatistics();
	}, [currentMonth]);

	// const handleCopyAddress = (text) => {
	// 	navigator?.clipboard
	// 		?.writeText(text)
	// 		.then(() => {
	// 			console.log(`Текст скопирован: ${text}`);
	// 		})
	// 		.catch((error) => {
	// 			console.error('Ошибка при копировании текста:', error);
	// 		});
	// };

	return (
		<>
			<Info personalcode={data?.personal_code} personalId={data?.id} emailConfirmStatus={data?.status} personalEmail={data?.email} />
			<Statistics
				totalOrders={userStatistics?.total_orders}
				setCurrentMonth={setCurrentMonth}
				totalPaid={userStatistics?.total_paid}
				deliveryLevel={userStatistics?.deliveryLevel}
				totalWeight={userStatistics?.total_weight}
        personalCode={data?.personal_code}
			/>
			<Level
				deliveryLevel={userStatisticsThreeMonth?.deliveryLevel}
				totalWeight={userStatisticsThreeMonth?.totalWeight}
        personalCode={data?.personal_code}
			/>
			<Information personalcode={data?.personal_code} />
		</>
	);
};
