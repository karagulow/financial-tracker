import { useRef, useEffect, useState } from 'react';

import styles from './AddTransaction.module.scss';
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
		transactionType: typeTransactionClick,
		transactionCategory: '',
		amount: '',
		date: '',
		description: '',
	});

	const handleFormDataChange = e => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	return (
		<div className={styles.add} ref={addRef}>
			<form className={styles.addBlock} ref={addBlockRef}>
				<h3 className={styles.addBlock__title}>Добавить операцию</h3>
				<div className={styles.addBlock__types}>
					<button
						className={`${styles.addBlock__typesBtn} ${incomeBtnStyles}`}
						onClick={() => {
							setTypeTransactionClick('income');
							setCategoriesOpen(false);
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
						<p className={styles.addBlock__inputsSelect__text}>
							{formData.transactionCategory || 'Категория'}
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
								categoriesData={[
									'Зарплата',
									'Стипендия',
									'Пенсия',
									'Подработка',
									'Бизнес',
									'Другое',
									'Другое',
									'Другое',
								]}
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
						type='text'
					/>
					<textarea
						className={styles.addBlock__inputsTextarea}
						name='description'
						value={formData.description}
						onChange={handleFormDataChange}
						placeholder='Заметка'
					></textarea>
				</div>
				<button className={styles.addBlock__submit} type='submit'>
					Добавить
				</button>
			</form>
		</div>
	);
};
