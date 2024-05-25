import { useRef, useEffect, useState } from 'react';

import styles from './AddTransaction.module.scss';
import supabase from '../../config/supabaseConfig';
import { CategoryChoosing } from '../CategoryChoosing';

export const AddTransaction = ({
	typeTransactionClick,
	setTypeTransactionClick,
	setAddTransactionOpen,
}) => {
	const incomeBtnStyles =
		typeTransactionClick === 'income'
			? styles.activeBtn
			: typeTransactionClick === 'expenses'
			? styles.inactiveBtn
			: null;

	const expensesBtnStyles =
		typeTransactionClick === 'expenses'
			? styles.activeBtn
			: typeTransactionClick === 'income'
			? styles.inactiveBtn
			: null;

	const addRef = useRef();
	const addBlockRef = useRef();
	useEffect(() => {
		const handleClickAddOutside = event => {
			if (
				event.composedPath().includes(addRef.current) &&
				!event.composedPath().includes(addBlockRef.current)
			) {
				setAddTransactionOpen(false);
			}
		};

		document.body.addEventListener('click', handleClickAddOutside);
		return () => {
			document.body.removeEventListener('click', handleClickAddOutside);
		};
	});

	useEffect(() => {
		const handleKeyPress = event => {
			if (event.key === 'Escape') {
				setAddTransactionOpen(false);
			}
		};

		document.addEventListener('keydown', handleKeyPress);

		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, []);

	const [categoriesOpen, setCategoriesOpen] = useState(false);

	const [formData, setFormData] = useState({
		transactionType: '',
		transactionCategory: '',
		amount: '',
		date: '',
		description: '',
	});

	const [categories, setCategories] = useState([]);

	const handleFormDataChange = e => {
		const { name, value } = e.target;
		let formattedValue = value;
		if (name === 'amount') {
			formattedValue = value.replace(/[^\d.]/g, '');
			const parts = formattedValue.split('.');
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
			if (parts[1] && parts[1].length > 2) {
				parts[1] = parts[1].slice(0, 2);
			}
			formattedValue = parts.join('.');
		}
		setFormData({
			...formData,
			[name]: formattedValue,
		});
	};

	const handleCategorySelect = categoryId => {
		setFormData({
			...formData,
			transactionCategory: categoryId,
		});
	};

	useEffect(() => {
		// Функция для запроса к transaction_types
		const fetchTransactionTypes = async () => {
			const { data, error } = await supabase
				.from('transaction_types')
				.select('id, name');

			if (error) {
				console.error('Ошибка при получении данных из Supabase:', error);
				return;
			}

			const incomeType = data.find(type => type.name === 'Доходы');
			const expensesType = data.find(type => type.name === 'Расходы');

			if (typeTransactionClick === 'income' && incomeType) {
				setFormData(prevFormData => ({
					...prevFormData,
					transactionType: incomeType.id,
				}));
			} else if (typeTransactionClick === 'expenses' && expensesType) {
				setFormData(prevFormData => ({
					...prevFormData,
					transactionType: expensesType.id,
				}));
			}
		};

		fetchTransactionTypes();
	}, [typeTransactionClick]);

	useEffect(() => {
		// Функция для запроса к transaction_categories
		const fetchTransactionCategories = async () => {
			if (formData.transactionType) {
				const { data, error } = await supabase
					.from('transaction_categories')
					.select('*')
					.eq('transaction_type_id', formData.transactionType);

				if (error) {
					console.error('Ошибка при получении категорий из Supabase:', error);
					return;
				}

				setCategories(data);
			}
		};

		fetchTransactionCategories();
	}, [formData.transactionType]);

	const [validationErrors, setValidationErrors] = useState();

	const addTransactionToDatabase = async () => {
		try {
			const { data, error } = await supabase.from('transactions').insert([
				{
					user_id: JSON.parse(localStorage.getItem('userState'))?.auth?.user
						?.id,
					date: formData.date,
					amount: parseFloat(formData.amount.replace(/\s/g, '')).toFixed(2),
					description: formData.description,
					transaction_type_id: formData.transactionType,
					transaction_category_id: formData.transactionCategory,
				},
			]);

			if (error) {
				console.error('Ошибка при добавлении транзакции:', error.message);
				return;
			}

			console.log('Транзакция успешно добавлена:', data);
		} catch (error) {
			console.error('Ошибка при добавлении транзакции:', error.message);
		}
	};

	const handleFormSubmit = async e => {
		e.preventDefault();

		if (!formData.transactionCategory || !formData.amount || !formData.date) {
			setValidationErrors(
				'Поля категории, суммы и даты должны быть заполнены!'
			);
			return;
		}

		setValidationErrors();
		await addTransactionToDatabase();
		setAddTransactionOpen(false);
	};

	return (
		<div className={styles.add} ref={addRef}>
			<form
				className={styles.addBlock}
				ref={addBlockRef}
				onSubmit={handleFormSubmit}
			>
				<h3 className={styles.addBlock__title}>Добавить операцию</h3>
				<div className={styles.addBlock__types}>
					<button
						className={`${styles.addBlock__typesBtn} ${incomeBtnStyles}`}
						onClick={() => {
							setTypeTransactionClick('income');
							setCategoriesOpen(false);
							setCategories([]);
							setFormData(prevFormData => ({
								...prevFormData,
								transactionCategory: '',
							}));
						}}
						type='button'
					>
						Доход
					</button>
					<button
						className={`${styles.addBlock__typesBtn} ${expensesBtnStyles}`}
						onClick={() => {
							setTypeTransactionClick('expenses');
							setCategoriesOpen(false);
							setCategories([]);
							setFormData(prevFormData => ({
								...prevFormData,
								transactionCategory: '',
							}));
						}}
						type='button'
					>
						Расход
					</button>
				</div>
				<div className={styles.addBlock__inputs}>
					<div
						className={styles.addBlock__inputsSelect}
						onClick={() => setCategoriesOpen(!categoriesOpen)}
					>
						<p
							className={`${styles.addBlock__inputsSelect__text} ${
								formData.transactionCategory &&
								styles.addBlock__inputsSelect__text_selected
							}`}
						>
							{categories.find(cat => cat.id === formData.transactionCategory)
								?.name || 'Категория'}
						</p>
						<div
							className={`${styles.addBlock__inputsSelect__icon} ${
								categoriesOpen && styles.addBlock__inputsSelect__icon_open
							}`}
						>
							<svg
								width='24'
								height='25'
								viewBox='0 0 24 25'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M6 9.5L11.2929 14.7929C11.6835 15.1835 12.3166 15.1835 12.7072 14.7929L18.0001 9.5'
									stroke='#E1E1E1'
									stroke-width='2.00002'
									stroke-linecap='round'
									stroke-linejoin='round'
								/>
							</svg>
						</div>
						{categoriesOpen && (
							<CategoryChoosing
								categoriesData={categories}
								onCategorySelect={handleCategorySelect}
							/>
						)}
					</div>
					<input
						className={styles.addBlock__inputsItem}
						name='amount'
						value={formData.amount}
						onChange={handleFormDataChange}
						placeholder='Сумма'
						type='text'
					/>
					<input
						className={styles.addBlock__inputsItem}
						name='date'
						value={formData.date}
						onChange={handleFormDataChange}
						placeholder='Дата'
						type='datetime-local'
					/>

					<textarea
						className={styles.addBlock__inputsTextarea}
						name='description'
						value={formData.description}
						onChange={handleFormDataChange}
						placeholder='Заметка'
					></textarea>
				</div>
				{validationErrors && (
					<p className={styles.addBlock__error}>{validationErrors}</p>
				)}
				<button className={styles.addBlock__submit} type='submit'>
					Добавить
				</button>
			</form>
		</div>
	);
};
