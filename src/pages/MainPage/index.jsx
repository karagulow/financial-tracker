import { useState, useEffect } from 'react';
import supabase from '../../config/supabaseConfig';

import styles from './MainPage.module.scss';

import { MainDashboard } from '../../components/MainDashboard';
import { CategoriesDashboard } from '../../components/CategoriesDashboard';

export const MainPage = () => {
	const [income, setIncome] = useState(0);
	const [expense, setExpense] = useState(0);
	const [balance, setBalance] = useState(0);
	const [transactionTypes, setTransactionTypes] = useState({});
	const [incomeCategories, setIncomeCategories] = useState([]);
	const [expenseCategories, setExpenseCategories] = useState([]);

	useEffect(() => {
		const fetchTransactionTypes = async () => {
			const { data, error } = await supabase
				.from('transaction_types')
				.select('*');

			if (error) {
				console.error('Error fetching transaction types:', error);
				return;
			}

			const types = data.reduce((acc, type) => {
				acc[type.name] = type.id;
				return acc;
			}, {});

			setTransactionTypes(types);
		};

		fetchTransactionTypes();
	}, []);

	useEffect(() => {
		if (Object.keys(transactionTypes).length > 0) {
			const fetchTransactions = async () => {
				const startOfMonth = new Date(
					new Date().getFullYear(),
					new Date().getMonth(),
					1
				).toISOString();
				const { data, error } = await supabase
					.from('transactions')
					.select('*')
					.eq(
						'user_id',
						JSON.parse(localStorage.getItem('userState'))?.auth?.user?.id
					)
					.gte('date', startOfMonth);

				if (error) {
					console.error('Error fetching transactions:', error);
					return;
				}

				const { data: categories, error: catError } = await supabase
					.from('transaction_categories')
					.select('id, name, transaction_type_id, icon')
					.eq(
						'user_id',
						JSON.parse(localStorage.getItem('userState'))?.auth?.user?.id
					);

				if (catError) {
					console.error('Error fetching categories:', catError);
					return;
				}

				const incomeTypeId = transactionTypes['Доходы'];
				const expenseTypeId = transactionTypes['Расходы'];

				const incomeData = data.filter(
					transaction => transaction.transaction_type_id === incomeTypeId
				);
				const expenseData = data.filter(
					transaction => transaction.transaction_type_id === expenseTypeId
				);

				const groupedIncome = incomeData.reduce((acc, transaction) => {
					const category = categories.find(
						cat => cat.id === transaction.transaction_category_id
					);
					const categoryName = category ? category.name : 'Прочие';
					const categoryItem = acc.find(item => item.name === categoryName);
					if (categoryItem) {
						categoryItem.amount += transaction.amount;
					} else {
						acc.push({
							name: categoryName,
							amount: transaction.amount,
							icon: category.icon,
						});
					}
					return acc;
				}, []);

				const groupedExpense = expenseData.reduce((acc, transaction) => {
					const category = categories.find(
						cat => cat.id === transaction.transaction_category_id
					);
					const categoryName = category ? category.name : 'Прочие';
					const categoryItem = acc.find(item => item.name === categoryName);
					if (categoryItem) {
						categoryItem.amount += transaction.amount;
					} else {
						acc.push({
							name: categoryName,
							amount: transaction.amount,
							icon: category.icon,
						});
					}
					return acc;
				}, []);

				const incomeSum = groupedIncome.reduce(
					(sum, category) => sum + category.amount,
					0
				);
				const expenseSum = groupedExpense.reduce(
					(sum, category) => sum + category.amount,
					0
				);

				setIncome(incomeSum);
				setExpense(expenseSum);
				setBalance(incomeSum - expenseSum);
				setIncomeCategories(groupedIncome);
				setExpenseCategories(groupedExpense);
			};

			fetchTransactions();
		}
	}, [transactionTypes]);

	return (
		<div className={styles.main}>
			<MainDashboard income={income} expense={expense} balance={balance} />
			<CategoriesDashboard
				transactionsType={'income'}
				dataList={incomeCategories}
			/>
			<CategoriesDashboard
				transactionsType={'expenses'}
				dataList={expenseCategories}
			/>
		</div>
	);
};
