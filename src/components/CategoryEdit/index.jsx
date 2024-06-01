import { useRef, useEffect, useState } from 'react';
import supabase from '../../config/supabaseConfig';

import styles from './CategoryEdit.module.scss';

export const CategoryEdit = ({
	setCategoryEditOpen,
	setSettingUpCategoriesOpen,
	categoryEditId,
}) => {
	const editRef = useRef();
	const editBlockRef = useRef();
	useEffect(() => {
		const handleClickAddOutside = event => {
			if (
				event.composedPath().includes(editRef.current) &&
				!event.composedPath().includes(editBlockRef.current)
			) {
				setCategoryEditOpen(false);
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
				setCategoryEditOpen(false);
				setSettingUpCategoriesOpen(true);
			}
		};

		document.addEventListener('keydown', handleKeyPress);

		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, []);

	const [formData, setFormData] = useState({
		name: '',
		icon: '',
		budget: '',
	});

	const handleFormDataChange = e => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleDeleteCategory = async () => {
		try {
			const { data, error } = await supabase
				.from('transaction_categories')
				.delete()
				.eq('id', categoryEditId);

			if (error) {
				throw error;
			}

			setCategoryEditOpen(false);
			setSettingUpCategoriesOpen(true);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const getCategory = async () => {
			const { data, error } = await supabase
				.from('transaction_categories')
				.select('*')
				.eq('id', categoryEditId)
				.single();

			if (error) {
				console.error('Error fetching categories:', error);
				return;
			}

			setFormData({ name: data.name, icon: data.icon, budget: data.budget });
		};

		getCategory();
	}, []);

	return (
		<div className={styles.edit} ref={editRef}>
			<form className={styles.editBlock} ref={editBlockRef}>
				<h3 className={styles.editBlock__title}>Редактирование категории</h3>
				<div className={styles.editBlock__wrapper}>
					<input
						className={styles.editBlock__wrapperInput}
						type='text'
						name='name'
						placeholder='Название категории'
						value={formData.name}
						onChange={handleFormDataChange}
					/>
					<input
						className={styles.editBlock__wrapperInput}
						type='text'
						name='budget'
						placeholder='Бюджет, ₽'
						value={formData.budget}
						onChange={handleFormDataChange}
					/>
					<div className={styles.editBlock__wrapperIcon_select}>
						<div className={styles.editBlock__wrapperIcon_select__icon}>
							<img
								className={styles.editBlock__wrapperIcon_select__iconImg}
								src={formData.icon}
								alt='icon'
							/>
						</div>
						<p className={styles.editBlock__wrapperIcon_select__text}>
							Инконка счета
						</p>
					</div>
				</div>
				<div className={styles.editBlock__btns}>
					<button
						className={styles.editBlock__btnsDelete}
						type='button'
						onClick={handleDeleteCategory}
					>
						Удалить
					</button>
					<button className={styles.editBlock__btnsSave} type='submit'>
						Сохранить
					</button>
				</div>
			</form>
		</div>
	);
};
