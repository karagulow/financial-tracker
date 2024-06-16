import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { CSSTransition } from 'react-transition-group';
import supabase from '../../config/supabaseConfig';

import styles from './Transactions.module.scss';
import { AddTransaction } from '../../components/AddTransaction';

const pageSize = 15;

const fetcher = async page => {
	const userState = JSON.parse(localStorage.getItem('userState'));
	const userId = userState?.auth?.user?.id;

	if (!userId) {
		console.error('User ID not found in localStorage');
		return [];
	}

	const { data, error } = await supabase
		.from('transactions')
		.select('*, transaction_categories(icon, name)')
		.eq('user_id', userId)
		.order('date', { ascending: false })
		.range((page - 1) * pageSize, page * pageSize - 1);

	if (error) {
		console.error('Error fetching operations:', error);
		throw new Error(error.message);
	}

	return data || [];
};

export const Transactions = () => {
	const [typeTransactionClick, setTypeTransactionClick] = useState('income');
	const [addTransactionOpen, setAddTransactionOpen] = useState(false);
	const [page, setPage] = useState(1);
	const [allData, setAllData] = useState([]);

	const { data, error, isValidating } = useSWR(
		['transactions', page],
		() => fetcher(page),
		{ revalidateOnFocus: false }
	);

	useEffect(() => {
		if (data && data.length > 0) {
			setAllData(prevData => [...prevData, ...data]);
		}
	}, [data]);

	const loadMore = () => {
		setPage(prevPage => prevPage + 1);
	};

	const allDataLoaded = data && data.length < pageSize;

	const groupedData = allData.reduce((acc, operation) => {
		const date = new Date(operation.date).toISOString().split('T')[0];
		if (!acc[date]) acc[date] = [];
		acc[date].push(operation);
		return acc;
	}, {});

	addTransactionOpen
		? (document.body.style.overflow = 'hidden')
		: (document.body.style.overflow = 'auto');

	const incomeStyles = {
		color: 'var(--green-color)',
	};

	const expensesStyles = {
		color: 'var(--red-color)',
	};

	return (
		<div className={styles.main}>
			<CSSTransition
				in={addTransactionOpen}
				timeout={300}
				classNames='popup-block'
				unmountOnExit
			>
				<AddTransaction
					setAddTransactionOpen={setAddTransactionOpen}
					typeTransactionClick={typeTransactionClick}
					setTypeTransactionClick={setTypeTransactionClick}
				/>
			</CSSTransition>
			<div className={styles.mainTop}>
				<h1 className={styles.mainTop__title}>История операций</h1>
				<button
					className={styles.mainTop__add}
					type='button'
					onClick={() => setAddTransactionOpen(true)}
				>
					Добавить операцию
				</button>
			</div>
			<div className={styles.mainContent}>
				{Object.keys(groupedData).length > 0 ? (
					Object.keys(groupedData).map(date => (
						<div className={styles.mainContent__day} key={date}>
							<h2 className={styles.mainContent__dayTitle}>
								{new Date(date).toLocaleDateString()}
							</h2>
							<ul className={styles.mainContent__dayTransactions}>
								{groupedData[date].map(transaction => (
									<li
										className={styles.mainContent__dayTransactions__item}
										key={transaction.id}
									>
										<div
											className={
												styles.mainContent__dayTransactions__itemDetails
											}
										>
											<div
												className={
													styles.mainContent__dayTransactions__itemDetails__icon
												}
											>
												<img
													src={transaction.transaction_categories.icon}
													alt='icon'
												/>
											</div>
											<div
												className={
													styles.mainContent__dayTransactions__itemDetails__values
												}
											>
												<p
													className={
														styles.mainContent__dayTransactions__itemDetails__valuesCount
													}
													style={
														transaction.transaction_type_id ===
														'4321d5a4-f17d-43a1-9702-9f222e9a7cd9'
															? expensesStyles
															: transaction.transaction_type_id ===
															  '33a63784-26fb-4b02-a800-93e46c519548'
															? incomeStyles
															: null
													}
												>
													{transaction.transaction_type_id ===
													'4321d5a4-f17d-43a1-9702-9f222e9a7cd9'
														? '-'
														: transaction.transaction_type_id ===
														  '33a63784-26fb-4b02-a800-93e46c519548'
														? '+'
														: null}{' '}
													{transaction.amount.toLocaleString()} ₽
												</p>
												<p
													className={
														styles.mainContent__dayTransactions__itemDetails__valuesName
													}
												>
													{transaction.transaction_categories.name}
												</p>
											</div>
										</div>
										<p
											className={
												styles.mainContent__dayTransactions__itemDescription
											}
										>
											{transaction.description}
										</p>
									</li>
								))}
							</ul>
						</div>
					))
				) : (
					<p className={styles.mainContent__not_found}>
						Финансовые операции не найдены
					</p>
				)}
				{!allDataLoaded && (
					<div className={styles.mainContent__load_more}>
						{isValidating ? (
							<p className={styles.mainContent__load_moreLoading}>
								Загрузка...
							</p>
						) : (
							<button
								className={styles.mainContent__load_moreBtn}
								onClick={loadMore}
								type='button'
							>
								Показать еще
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
