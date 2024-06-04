import { useState } from 'react';
import useSWR from 'swr';
import { CSSTransition } from 'react-transition-group';
import supabase from '../../config/supabaseConfig';

import styles from './Transactions.module.scss';
import { AddTransaction } from '../../components/AddTransaction';

export const Transactions = () => {
	const [typeTransactionClick, setTypeTransactionClick] = useState('income');
	const [addTransactionOpen, setAddTransactionOpen] = useState(false);
	const [allDataLoaded, setAllDataLoaded] = useState(false);

	const [page, setPage] = useState(1);

	const fetcher = async page => {
		const pageSize = 5;
		const userState = JSON.parse(localStorage.getItem('userState'));
		const userId = userState?.auth?.user?.id;

		if (!userId) {
			console.error('User ID not found in localStorage');
			return {};
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

		if (!data || data.length === 0) {
			console.log('No data returned from Supabase');
			return {};
		}

		const groupedData = data.reduce((acc, operation) => {
			const date = new Date(operation.date).toISOString().split('T')[0];
			if (!acc[date]) acc[date] = [];
			acc[date].push(operation);
			return acc;
		}, {});

		if (data.length < pageSize) {
			setAllDataLoaded(true);
		}

		return groupedData;
	};

	const { data, error, isValidating } = useSWR(
		['transactions', page],
		() => fetcher(page),
		{ revalidateOnFocus: false }
	);

	const loadMore = () => {
		setPage(prevPage => prevPage + 1);
	};

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
				{data && Object.keys(data).length > 0 ? (
					Object.keys(data).map(date => (
						<div className={styles.mainContent__day} key={date}>
							<h2 className={styles.mainContent__dayTitle}>
								{new Date(date).toLocaleDateString()}
							</h2>
							<ul className={styles.mainContent__dayTransactions}>
								{data[date].map(transaction => (
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
					<p className={styles.mainContent__not_found}>Операций нет</p>
				)}
			</div>
			<div>
				{error && <p>{error.message}</p>}
				<div>
					{data && Object.keys(data).length > 0 ? (
						Object.keys(data).map(date => (
							<div key={date}>
								<h2>{new Date(date).toLocaleDateString()}</h2>
								<ul>
									{data[date].map(operation => (
										<li key={operation.id}>
											<strong>
												{operation.amount} {operation.currency}
											</strong>{' '}
											- {operation.operation_type} <br />
											{operation.description} <br />
											<em>{new Date(operation.date).toLocaleString()}</em>
										</li>
									))}
								</ul>
							</div>
						))
					) : (
						<p>No operations found</p>
					)}
				</div>
				{!allDataLoaded && (
					<div>
						{isValidating ? (
							<p>Loading...</p>
						) : (
							<button onClick={loadMore}>Load More</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
