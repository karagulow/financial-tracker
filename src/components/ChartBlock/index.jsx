import { useState, useEffect } from 'react';
import supabase from '../../config/supabaseConfig';
import * as tf from '@tensorflow/tfjs';

import styles from './ChartBlock.module.scss';
import { LineChart } from '../LineChart';
import { BarChart } from '../BarChart';

export const ChartBlock = ({ chartName, chartType, transactionType }) => {
	const [activePeriod, setActivePeriod] = useState('year');
	const [chartData, setChartData] = useState({});
	const [pastIncomeData, setPastIncomeData] = useState();
	const [pastExpenseData, setPastExpenseData] = useState();

	const userState = JSON.parse(localStorage.getItem('userState'));
	const userId = userState?.auth?.user?.id;

	useEffect(() => {
		if (userId) {
			fetchData();
		} else {
			console.error('User ID not found in localStorage');
		}
	}, [activePeriod, transactionType, userId]);

	useEffect(() => {
		if (pastIncomeData && pastExpenseData) {
			predictFutureData(pastIncomeData, pastExpenseData);
		}
	}, [pastIncomeData, pastExpenseData]);

	const handleActivePeriod = value => {
		setActivePeriod(value);
	};

	const getStartDate = period => {
		const now = new Date();
		switch (period) {
			case 'week':
				return new Date(now.setDate(now.getDate() - 7));
			case 'month':
				return new Date(now.setMonth(now.getMonth() - 1));
			case 'year':
				return new Date(now.setFullYear(now.getFullYear() - 1));
			default:
				return new Date(now.setMonth(now.getMonth() - 1));
		}
	};

	const fetchData = async () => {
		const startDate = getStartDate(activePeriod);
		let query = supabase
			.from('transactions')
			.select('date, amount, transaction_type_id')
			.eq('user_id', userId)
			.gte('date', startDate.toISOString());

		if (transactionType) {
			query = query.eq('transaction_type_id', transactionType);
		}

		const { data: transactions, error } = await query;

		if (error) {
			console.log('Error fetching transactions:', error);
		} else {
			processChartData(transactions);
		}
	};

	const generateLabels = period => {
		const labels = [];
		const now = new Date();

		if (period === 'year') {
			for (let i = 0; i < 12; i++) {
				const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
				labels.unshift(date.toLocaleString('default', { month: 'short' }));
			}
		} else {
			const days = period === 'week' ? 7 : 30;
			for (let i = 0; i < days; i++) {
				const date = new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate() - i
				);
				labels.unshift(date.toLocaleDateString());
			}
		}

		return labels;
	};

	const [blockMessage, setBlockMessage] = useState();
	const calculateAverageAnnualGrowth = balanceData => {
		const firstNonZeroIndex = balanceData.findIndex(balance => balance !== 0);
		if (firstNonZeroIndex === -1) {
			return null;
		}
		const startBalance = balanceData[firstNonZeroIndex];
		const endBalance = balanceData[balanceData.length - 1];
		const change = endBalance - startBalance;
		const percentageChange = (change / startBalance) * 100;
		const numberOfYears = (balanceData.length - firstNonZeroIndex) / 12;
		const averageAnnualGrowth = percentageChange / numberOfYears;
		return averageAnnualGrowth;
	};

	const processChartData = transactions => {
		const incomeData = {};
		const expenseData = {};
		const labels = generateLabels(activePeriod);

		transactions.forEach(transaction => {
			const date = new Date(transaction.date);
			const formattedDate =
				activePeriod === 'year'
					? date.toLocaleString('default', { month: 'short' })
					: date.toLocaleDateString();

			if (
				transaction.transaction_type_id ===
				'33a63784-26fb-4b02-a800-93e46c519548'
			) {
				if (!incomeData[formattedDate]) {
					incomeData[formattedDate] = 0;
				}
				incomeData[formattedDate] += transaction.amount;
			} else if (
				transaction.transaction_type_id ===
				'4321d5a4-f17d-43a1-9702-9f222e9a7cd9'
			) {
				if (!expenseData[formattedDate]) {
					expenseData[formattedDate] = 0;
				}
				expenseData[formattedDate] += transaction.amount;
			}
		});

		const lineIncomeData = [];
		const lineExpenseData = [];

		labels.forEach(label => {
			lineIncomeData.push(incomeData[label] || 0);
			lineExpenseData.push(expenseData[label] || 0);
		});

		if (chartName === 'Доходы и расходы') {
			setChartData({
				labels: labels,
				datasets: [
					{
						label: 'Доходы',
						data: lineIncomeData,
						borderColor: 'rgba(127, 190, 98, 1)',
						backgroundColor: 'rgba(127, 190, 98, 0.7)',
						fill: false,
						tension: 0.4,
					},
					{
						label: 'Расходы',
						data: lineExpenseData,
						borderColor: 'rgba(194, 80, 80, 1)',
						backgroundColor: 'rgba(194, 80, 80, 0.7)',
						fill: false,
						tension: 0.4,
					},
				],
			});
		} else if (chartName === 'Доходы' || chartName === 'Расходы') {
			const data =
				transactionType === '33a63784-26fb-4b02-a800-93e46c519548'
					? lineIncomeData
					: lineExpenseData;
			setChartData({
				labels: labels,
				datasets: [
					{
						label:
							transactionType === '33a63784-26fb-4b02-a800-93e46c519548'
								? 'Доходы'
								: 'Расходы',
						data: Object.values(data),
						backgroundColor:
							transactionType === '33a63784-26fb-4b02-a800-93e46c519548'
								? 'rgba(127, 190, 98, 0.7)'
								: 'rgba(194, 80, 80, 0.7)',
						borderColor:
							transactionType === '33a63784-26fb-4b02-a800-93e46c519548'
								? 'rgba(127, 190, 98, 1)'
								: 'rgba(194, 80, 80, 1)',
						borderWidth: 1,
						borderRadius: 6,
					},
				],
			});
		} else if (chartName === 'Сальдо') {
			const balanceData = [];

			labels.forEach((label, index) => {
				const income = lineIncomeData[index] || 0;
				const expense = lineExpenseData[index] || 0;
				let balance = income - expense;
				balanceData.push(balance);
			});

			setChartData({
				labels: labels,
				datasets: [
					{
						label: 'Сальдо',
						data: balanceData,
						borderColor: 'rgba(70, 130, 180, 1)',
						backgroundColor: 'rgba(70, 130, 180, 0.7)',
						fill: false,
						tension: 0.4,
					},
				],
			});

			const averageAnnualGrowth = calculateAverageAnnualGrowth(balanceData);
			const message =
				averageAnnualGrowth !== null
					? `Среднегодовой прирост сальдо: ${averageAnnualGrowth.toFixed(2)}%`
					: 'Не удалось вычислить среднегодовой прирост сальдо, так как начальный баланс равен нулю.';
			setBlockMessage(message);
		} else if (chartName === 'Прогнозирование доходов и расходов') {
			setPastIncomeData(lineIncomeData);
			setPastExpenseData(lineExpenseData);
		}
	};

	const predictFutureData = async (lineIncomeData, lineExpenseData) => {
		const pastDataLength = lineIncomeData.length;

		const futureDataLength = 12;

		const xs = tf.tensor2d(
			Array.from({ length: pastDataLength }, (_, index) => [index]),
			[pastDataLength, 1]
		);
		const ysIncome = tf.tensor2d(lineIncomeData, [pastDataLength, 1]);
		const ysExpense = tf.tensor2d(lineExpenseData, [pastDataLength, 1]);

		const modelIncome = tf.sequential();
		modelIncome.add(tf.layers.dense({ units: 1, inputShape: [1] }));
		modelIncome.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

		const modelExpense = tf.sequential();
		modelExpense.add(tf.layers.dense({ units: 1, inputShape: [1] }));
		modelExpense.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

		await modelIncome.fit(xs, ysIncome, { epochs: 250 });
		await modelExpense.fit(xs, ysExpense, { epochs: 250 });

		const futureIndices = Array.from(
			{ length: futureDataLength },
			(_, i) => i + pastDataLength
		);
		const futureXs = tf.tensor2d(
			futureIndices.map(index => [index]),
			[futureDataLength, 1]
		);

		const predictedYsIncome = modelIncome.predict(futureXs);
		const predictedYsExpense = modelExpense.predict(futureXs);

		const predictionsIncome = await predictedYsIncome.array();
		const predictionsExpense = await predictedYsExpense.array();

		const futureIncomeData = predictionsIncome.flat();
		const futureExpenseData = predictionsExpense.flat();
		const labels = generateLabels('year');

		setChartData({
			labels: labels,
			datasets: [
				{
					label: 'Будущие доходы',
					data: futureIncomeData,
					borderColor: 'rgba(127, 190, 98, 1)',
					backgroundColor: 'rgba(127, 190, 98, 0.7)',
					fill: false,
					tension: 0.4,
				},
				{
					label: 'Будущие расходы',
					data: futureExpenseData,
					borderColor: 'rgba(194, 80, 80, 1)',
					backgroundColor: 'rgba(194, 80, 80, 0.7)',
					fill: false,
					tension: 0.4,
				},
			],
		});
	};

	return (
		<div className={styles.block}>
			<div className={styles.blockTop}>
				<h1 className={styles.blockTop__title}>{chartName}</h1>
				{chartName !== 'Сальдо' ? (
					<div className={styles.blockTop__period}>
						<button
							className={`${styles.blockTop__periodBtn} ${
								activePeriod === 'week' && styles.blockTop__periodBtn_active
							}`}
							onClick={() => handleActivePeriod('week')}
							type='button'
						>
							Неделя
						</button>
						<button
							className={`${styles.blockTop__periodBtn} ${
								activePeriod === 'month' && styles.blockTop__periodBtn_active
							}`}
							onClick={() => handleActivePeriod('month')}
							type='button'
						>
							Месяц
						</button>
						<button
							className={`${styles.blockTop__periodBtn} ${
								activePeriod === 'year' && styles.blockTop__periodBtn_active
							}`}
							onClick={() => handleActivePeriod('year')}
							type='button'
						>
							Год
						</button>
					</div>
				) : (
					<></>
				)}
			</div>
			<hr className={styles.blockLine} />
			<div className={styles.blockChart}>
				{chartType === 'line' &&
					chartName !== 'Прогнозирование доходов и расходов' && (
						<LineChart chartData={chartData} />
					)}
				{chartType === 'line' &&
					chartName === 'Прогнозирование доходов и расходов' && (
						<LineChart chartData={chartData} />
					)}
				{chartType === 'bar' && <BarChart chartData={chartData} />}
			</div>
			{chartName === 'Сальдо' && (
				<p className={styles.blockMessage}>{blockMessage}</p>
			)}
		</div>
	);
};
