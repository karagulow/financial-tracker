import { useRef, useEffect, useState } from 'react';
import supabase from '../../config/supabaseConfig';

import styles from './SettingUpCategories.module.scss';

export const SettingUpCategories = ({
	setSettingUpCategoriesOpen,
	setCategoryCreateOpen,
	setCategoryEditOpen,
	setTypeTransactionClick,
	setCategoryEditId,
	categoryCreateOpen,
	categoryEditOpen,
}) => {
	const categoriesRef = useRef();
	const categoriesBlockRef = useRef();
	useEffect(() => {
		const handleClickAddOutside = event => {
			if (
				event.composedPath().includes(categoriesRef.current) &&
				!event.composedPath().includes(categoriesBlockRef.current)
			) {
				setSettingUpCategoriesOpen(false);
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
				setSettingUpCategoriesOpen(false);
			}
		};

		document.addEventListener('keydown', handleKeyPress);

		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, []);

	const [incomeList, setIncomeList] = useState();
	const [expensesList, setExpensesList] = useState();

	useEffect(() => {
		const getCategories = async () => {
			const { data, error } = await supabase
				.from('transaction_categories')
				.select('*')
				.eq(
					'user_id',
					JSON.parse(localStorage.getItem('userState'))?.auth?.user?.id
				);

			if (error) {
				console.error('Error fetching categories:', error);
				return;
			}

			setIncomeList(
				data.filter(
					category =>
						category.transaction_type_id ===
						'33a63784-26fb-4b02-a800-93e46c519548'
				)
			);

			setExpensesList(
				data.filter(
					category =>
						category.transaction_type_id ===
						'4321d5a4-f17d-43a1-9702-9f222e9a7cd9'
				)
			);
		};

		getCategories();
	}, []);

	return (
		<div
			className={styles.categories}
			ref={categoriesRef}
			style={categoryCreateOpen || categoryEditOpen ? { opacity: '0' } : null}
		>
			<div className={styles.categoriesBlock} ref={categoriesBlockRef}>
				<h3 className={styles.categoriesBlock__title}>
					Редактировать категории
				</h3>
				<div className={styles.categoriesBlock__wrapper}>
					<div className={styles.categoriesBlock__wrapperType}>
						<div className={styles.categoriesBlock__wrapperType__name}>
							Доходы
						</div>
						<ul className={styles.categoriesBlock__wrapperType__list}>
							{incomeList &&
								incomeList.map((category, index) => (
									<li
										className={styles.categoriesBlock__wrapperType__listItem}
										key={index}
									>
										<div
											className={
												styles.categoriesBlock__wrapperType__listItem__left
											}
										>
											<div
												className={
													styles.categoriesBlock__wrapperType__listItem__leftIcon
												}
											>
												<img
													className={
														styles.categoriesBlock__wrapperType__listItem__leftIcon__img
													}
													src={category.icon}
													alt='icon'
												/>
											</div>
											<p
												className={
													styles.categoriesBlock__wrapperType__listItem__leftName
												}
											>
												{category.name}
											</p>
										</div>
										<button
											className={
												styles.categoriesBlock__wrapperType__listItem__edit
											}
											type='button'
											onClick={() => {
												setCategoryEditOpen(true);
												setSettingUpCategoriesOpen(false);
												setCategoryEditId(category.id);
											}}
										>
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													fill-rule='evenodd'
													clip-rule='evenodd'
													d='M14.7571 2.62097C15.6353 1.74284 16.8263 1.24951 18.0681 1.24951C19.31 1.24951 20.501 1.74284 21.3791 2.62097C22.2573 3.4991 22.7506 4.69011 22.7506 5.93197C22.7506 7.17384 22.2573 8.36484 21.3791 9.24297L11.8931 18.729C11.3511 19.271 11.0331 19.589 10.6771 19.866C10.2591 20.193 9.80714 20.473 9.32714 20.701C8.92114 20.894 8.49314 21.037 7.76714 21.279L4.43514 22.389L3.63314 22.657C3.31417 22.7635 2.97184 22.779 2.64454 22.7018C2.31724 22.6246 2.01792 22.4578 1.78014 22.22C1.54235 21.9822 1.37551 21.6829 1.29833 21.3556C1.22114 21.0283 1.23666 20.6859 1.34314 20.367L2.72114 16.234C2.96314 15.507 3.10614 15.079 3.29914 14.672C3.52814 14.193 3.80714 13.741 4.13414 13.322C4.41014 12.968 4.72914 12.649 5.27114 12.107L14.7571 2.62097ZM4.40014 20.821L7.24114 19.873C8.03214 19.609 8.36814 19.496 8.68114 19.347C9.06114 19.165 9.42114 18.943 9.75414 18.684C10.0271 18.47 10.2791 18.221 10.8691 17.631L18.4391 10.061C17.4012 9.69319 16.4591 9.09722 15.6821 8.31697C14.9026 7.53984 14.3073 6.59771 13.9401 5.55997L6.37014 13.13C5.78014 13.719 5.53014 13.97 5.31714 14.244C5.05818 14.5767 4.8359 14.9365 4.65414 15.317C4.50514 15.63 4.39214 15.966 4.12814 16.757L3.18014 19.6L4.40014 20.821ZM15.1551 4.34297C15.1901 4.51797 15.2471 4.75597 15.3441 5.03297C15.6366 5.87007 16.1153 6.62983 16.7441 7.25497C17.369 7.88369 18.1284 8.36238 18.9651 8.65497C19.2431 8.75197 19.4811 8.80897 19.6561 8.84397L20.3181 8.18197C20.9114 7.58452 21.2437 6.77627 21.2423 5.93428C21.2408 5.09229 20.9057 4.28521 20.3103 3.68983C19.7149 3.09446 18.9078 2.75932 18.0658 2.75785C17.2238 2.75638 16.4156 3.08868 15.8181 3.68197L15.1551 4.34297Z'
													fill='#333333'
												/>
											</svg>
										</button>
									</li>
								))}
						</ul>
					</div>

					<div className={styles.categoriesBlock__wrapperType}>
						<div className={styles.categoriesBlock__wrapperType__name}>
							Расходы
						</div>
						<ul className={styles.categoriesBlock__wrapperType__list}>
							{expensesList &&
								expensesList.map((category, index) => (
									<li
										className={styles.categoriesBlock__wrapperType__listItem}
										key={index}
									>
										<div
											className={
												styles.categoriesBlock__wrapperType__listItem__left
											}
										>
											<div
												className={
													styles.categoriesBlock__wrapperType__listItem__leftIcon
												}
											>
												<img
													className={
														styles.categoriesBlock__wrapperType__listItem__leftIcon__img
													}
													src={category.icon}
													alt='icon'
												/>
											</div>
											<p
												className={
													styles.categoriesBlock__wrapperType__listItem__leftName
												}
											>
												{category.name}
											</p>
										</div>
										<button
											className={
												styles.categoriesBlock__wrapperType__listItem__edit
											}
											type='button'
											onClick={() => {
												setCategoryEditOpen(true);
												setSettingUpCategoriesOpen(false);
											}}
										>
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													fill-rule='evenodd'
													clip-rule='evenodd'
													d='M14.7571 2.62097C15.6353 1.74284 16.8263 1.24951 18.0681 1.24951C19.31 1.24951 20.501 1.74284 21.3791 2.62097C22.2573 3.4991 22.7506 4.69011 22.7506 5.93197C22.7506 7.17384 22.2573 8.36484 21.3791 9.24297L11.8931 18.729C11.3511 19.271 11.0331 19.589 10.6771 19.866C10.2591 20.193 9.80714 20.473 9.32714 20.701C8.92114 20.894 8.49314 21.037 7.76714 21.279L4.43514 22.389L3.63314 22.657C3.31417 22.7635 2.97184 22.779 2.64454 22.7018C2.31724 22.6246 2.01792 22.4578 1.78014 22.22C1.54235 21.9822 1.37551 21.6829 1.29833 21.3556C1.22114 21.0283 1.23666 20.6859 1.34314 20.367L2.72114 16.234C2.96314 15.507 3.10614 15.079 3.29914 14.672C3.52814 14.193 3.80714 13.741 4.13414 13.322C4.41014 12.968 4.72914 12.649 5.27114 12.107L14.7571 2.62097ZM4.40014 20.821L7.24114 19.873C8.03214 19.609 8.36814 19.496 8.68114 19.347C9.06114 19.165 9.42114 18.943 9.75414 18.684C10.0271 18.47 10.2791 18.221 10.8691 17.631L18.4391 10.061C17.4012 9.69319 16.4591 9.09722 15.6821 8.31697C14.9026 7.53984 14.3073 6.59771 13.9401 5.55997L6.37014 13.13C5.78014 13.719 5.53014 13.97 5.31714 14.244C5.05818 14.5767 4.8359 14.9365 4.65414 15.317C4.50514 15.63 4.39214 15.966 4.12814 16.757L3.18014 19.6L4.40014 20.821ZM15.1551 4.34297C15.1901 4.51797 15.2471 4.75597 15.3441 5.03297C15.6366 5.87007 16.1153 6.62983 16.7441 7.25497C17.369 7.88369 18.1284 8.36238 18.9651 8.65497C19.2431 8.75197 19.4811 8.80897 19.6561 8.84397L20.3181 8.18197C20.9114 7.58452 21.2437 6.77627 21.2423 5.93428C21.2408 5.09229 20.9057 4.28521 20.3103 3.68983C19.7149 3.09446 18.9078 2.75932 18.0658 2.75785C17.2238 2.75638 16.4156 3.08868 15.8181 3.68197L15.1551 4.34297Z'
													fill='#333333'
												/>
											</svg>
										</button>
									</li>
								))}
						</ul>
					</div>
				</div>
				<div className={styles.categoriesBlock__btns}>
					<button
						className={styles.categoriesBlock__btnsCreate}
						type='button'
						onClick={() => {
							setCategoryCreateOpen(true);
							setTypeTransactionClick('income');
						}}
					>
						Создать новую категорию дохода
					</button>
					<button
						className={styles.categoriesBlock__btnsCreate}
						type='button'
						onClick={() => {
							setCategoryCreateOpen(true);
							setTypeTransactionClick('expenses');
						}}
					>
						Создать новую категорию расхода
					</button>
				</div>
			</div>
		</div>
	);
};
