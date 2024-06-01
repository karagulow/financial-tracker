import { useState } from 'react';

import styles from './CategoriesDashboard.module.scss';

import { AddTransaction } from '../AddTransaction';

export const CategoriesDashboard = ({ transactionsType, dataList }) => {
	const [addTransactionOpen, setAddTransactionOpen] = useState(false);
	const [typeTransactionClick, setTypeTransactionClick] =
		useState(transactionsType);

	addTransactionOpen
		? (document.body.style.overflow = 'hidden')
		: (document.body.style.overflow = 'auto');

	const dashboardName =
		transactionsType === 'income'
			? 'Доходы'
			: transactionsType === 'expenses'
			? 'Расходы'
			: 'Не определено';

	const valueColor =
		transactionsType === 'income'
			? styles.income
			: transactionsType === 'expenses'
			? styles.expenses
			: 'Не определено';

	const categoriesData =
		transactionsType === 'income'
			? 'Здесь массив доходов по категориям'
			: transactionsType === 'expenses'
			? 'Здесь массив расходов по категориям'
			: null;

	return (
		<div className={styles.dashboard}>
			<div className={styles.dashboardHeader}>
				<h3 className={styles.dashboardHeader__title}>{dashboardName}</h3>
				<button
					className={styles.dashboardHeader__add_btn}
					onClick={() => {
						setAddTransactionOpen(true);
					}}
				>
					Добавить
				</button>
			</div>
			<div className={styles.dashboardCategories}>
				{dataList.map((data, index) => (
					<div className={styles.dashboardCategories__item} key={index}>
						<div className={styles.dashboardCategories__itemIcon}>
							<img
								className={styles.dashboardCategories__itemIcon__img}
								src={data.icon}
							/>
						</div>
						<div className={styles.dashboardCategories__itemValues}>
							<h5
								className={`${styles.dashboardCategories__itemValues__count} ${valueColor}`}
							>
								{data.amount.toLocaleString()} ₽
							</h5>
							<p className={styles.dashboardCategories__itemValues__name}>
								{data.name}
							</p>
						</div>
					</div>
				))}
			</div>
			{addTransactionOpen && (
				<AddTransaction
					typeTransactionClick={typeTransactionClick}
					setTypeTransactionClick={setTypeTransactionClick}
					setAddTransactionOpen={setAddTransactionOpen}
				/>
			)}
		</div>
	);
};
