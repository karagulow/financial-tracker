import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import styles from './MainDashboard.module.scss';

export const MainDashboard = () => {
	const [rates, setRates] = useState({ USD: 0, EUR: 0 });

	useEffect(() => {
		const fetchRates = async () => {
			try {
				const response = await axios.get(
					'https://www.cbr-xml-daily.ru/daily_json.js'
				);
				const data = response.data.Valute;
				setRates({
					USD: data.USD.Value.toFixed(1).replace('.', ','),
					EUR: data.EUR.Value.toFixed(1).replace('.', ','),
				});
			} catch (err) {
				throw err;
			}
		};

		fetchRates();
	}, []);

	return (
		<div className={styles.dashboard}>
			<div className={styles.dashboardHeader}>
				<h1 className={styles.dashboardHeader__title}>Сентябрь 2024</h1>
				<div className={styles.dashboardHeader__rates}>
					<div className={styles.dashboardHeader__ratesItem}>
						1 USD = {rates.USD} RUB
					</div>
					<div className={styles.dashboardHeader__ratesItem}>
						1 EUR = {rates.EUR} RUB
					</div>
				</div>
			</div>
			<div className={styles.dashboardStat}>
				<div className={styles.dashboardStat__item}>
					<h4 className={styles.dashboardStat__itemValue}>367 990 ₽</h4>
					<p className={styles.dashboardStat__itemName}>Доход</p>
				</div>
				<div className={styles.dashboardStat__item}>
					<h4 className={styles.dashboardStat__itemValue}>298 500 ₽</h4>
					<p className={styles.dashboardStat__itemName}>Расход</p>
				</div>
				<div className={styles.dashboardStat__item}>
					<h4 className={styles.dashboardStat__itemValue}>187 412 ₽</h4>
					<p className={styles.dashboardStat__itemName}>Баланс</p>
				</div>
				<div className={styles.dashboardStat__item}>
					<h4 className={styles.dashboardStat__itemValue}>50 000 ₽</h4>
					<p className={styles.dashboardStat__itemName}>Долги</p>
				</div>
			</div>
		</div>
	);
};
