import styles from './CategoriesDashboard.module.scss';

export const CategoriesDashboard = ({ transactionsType }) => {
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
				<button className={styles.dashboardHeader__add_btn}>Добавить</button>
			</div>
			<div className={styles.dashboardCategories}>
				{[...Array(6)].map(() => (
					<div className={styles.dashboardCategories__item}>
						<img
							className={styles.dashboardCategories__itemIcon}
							src=''
							alt='category-icon'
						/>
						<div className={styles.dashboardCategories__itemValues}>
							<h5
								className={`${styles.dashboardCategories__itemValues__count} ${valueColor}`}
							>
								150 000 ₽
							</h5>
							<p className={styles.dashboardCategories__itemValues__name}>
								Работа
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
