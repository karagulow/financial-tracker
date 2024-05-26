import { useState, useEffect } from 'react';
import axios from 'axios';

import styles from './MainDashboard.module.scss';

const getCurrentMonthYear = () => {
	const months = [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь',
	];
	const date = new Date();
	const month = months[date.getMonth()];
	const year = date.getFullYear();
	return `${month} ${year}`;
};

export const MainDashboard = ({ income, expense, balance }) => {
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
				<h1 className={styles.dashboardHeader__title}>
					{getCurrentMonthYear()}
				</h1>
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
					<h4 className={styles.dashboardStat__itemValue}>
						{income.toLocaleString()} ₽
					</h4>
					<p className={styles.dashboardStat__itemName}>Доход</p>
				</div>
				<div className={styles.dashboardStat__item}>
					<h4 className={styles.dashboardStat__itemValue}>
						{expense.toLocaleString()} ₽
					</h4>
					<p className={styles.dashboardStat__itemName}>Расход</p>
				</div>
				<div className={styles.dashboardStat__item}>
					<h4 className={styles.dashboardStat__itemValue}>
						{balance.toLocaleString()} ₽
					</h4>
					<p className={styles.dashboardStat__itemName}>Сальдо</p>
				</div>
				<div className={styles.dashboardStat__item}>
					<h4 className={styles.dashboardStat__itemValue}>50 000 ₽</h4>
					<p className={styles.dashboardStat__itemName}>Долги</p>
				</div>
			</div>
		</div>
	);
};
