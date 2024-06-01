import { useRef, useEffect, useState } from 'react';
import supabase from '../../config/supabaseConfig';

import styles from './CategoryCreate.module.scss';

export const CategoryCreate = ({
	setCategoryCreateOpen,
	setSettingUpCategoriesOpen,
	typeTransactionClick,
}) => {
	const createRef = useRef();
	const createBlockRef = useRef();
	useEffect(() => {
		const handleClickAddOutside = event => {
			if (
				event.composedPath().includes(createRef.current) &&
				!event.composedPath().includes(createBlockRef.current)
			) {
				setCategoryCreateOpen(false);
				setSettingUpCategoriesOpen(true);
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
				setCategoryCreateOpen(false);
				setSettingUpCategoriesOpen(true);
			}
		};

		document.addEventListener('keydown', handleKeyPress);

		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, []);

	const categoryTypeName =
		typeTransactionClick === 'income'
			? 'дохода'
			: typeTransactionClick === 'expenses'
			? 'расхода'
			: '';

	const [formData, setFormData] = useState({
		name: '',
		icon: 'https://dgcerzjhlhayjaauevth.supabase.co/storage/v1/object/public/category_icons/solar_widget-6-outline.svg',
		budget: '',
		transactionType:
			typeTransactionClick === 'income'
				? '33a63784-26fb-4b02-a800-93e46c519548'
				: typeTransactionClick === 'expenses'
				? '4321d5a4-f17d-43a1-9702-9f222e9a7cd9'
				: null,
	});

	const handleFormDataChange = e => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const [categoryIcons, setCategoryIcons] = useState([]);
	useEffect(() => {
		const getCategoryIcons = async () => {
			const { data, error } = await supabase.storage
				.from('category_icons')
				.list('', {
					limit: 100,
					offset: 0,
				});

			if (error) {
				console.error('Error fetching images:', error);
				return;
			}

			const imageUrls = await Promise.all(
				data.map(async file => {
					const { publicURL, error: urlError } = supabase.storage
						.from('category_icons')
						.getPublicUrl(file.name);

					if (urlError) {
						console.error('Error getting public URL:', urlError);
						return null;
					}

					return publicURL;
				})
			);

			setCategoryIcons(imageUrls.filter(url => url !== null));
		};

		getCategoryIcons();
	}, []);

	const handleFormSubmit = async e => {
		e.preventDefault();

		const addCategoryToDatabase = async () => {
			const categoryData = {
				user_id: JSON.parse(localStorage.getItem('userState'))?.auth?.user?.id,
				transaction_type_id: formData.transactionType,
				name: formData.name,
				icon: formData.icon,
			};

			if (formData.budget) {
				categoryData.budget = Number(formData.budget);
			}

			try {
				const { data, error } = await supabase
					.from('transaction_categories')
					.insert(categoryData);

				if (error) {
					console.error('Ошибка при добавлении категории:', error.message);
					return;
				}

				console.log('Категория успешно добавлена:', data);
				setCategoryCreateOpen(false);
				setSettingUpCategoriesOpen(true);
			} catch (error) {
				console.error('Ошибка при добавлении категории:', error.message);
			}
		};

		formData.name && addCategoryToDatabase();
	};

	return (
		<div className={styles.create} ref={createRef}>
			<form
				className={styles.createBlock}
				ref={createBlockRef}
				onSubmit={handleFormSubmit}
			>
				<h3
					className={styles.createBlock__title}
				>{`Новая категория ${categoryTypeName}`}</h3>
				<div className={styles.createBlock__wrapper}>
					<input
						className={styles.createBlock__wrapperInput}
						type='text'
						name='name'
						placeholder='Название категории'
						value={formData.name}
						onChange={handleFormDataChange}
					/>
					{typeTransactionClick === 'expenses' && (
						<input
							className={styles.createBlock__wrapperInput}
							type='text'
							name='budget'
							placeholder='Бюджет, ₽'
							value={formData.budget}
							onChange={handleFormDataChange}
						/>
					)}
					<div className={styles.createBlock__wrapperIcon_select}>
						<div className={styles.createBlock__wrapperIcon_select__icon}>
							<img
								className={styles.createBlock__wrapperIcon_select__iconImg}
								src={formData.icon}
								alt='icon'
							/>
						</div>
						<p className={styles.createBlock__wrapperIcon_select__text}>
							Инконка счета
						</p>
					</div>
				</div>
				<button className={styles.createBlock__submit}>Создать</button>
			</form>
		</div>
	);
};
