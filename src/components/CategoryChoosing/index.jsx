import styles from './CategoryChoosing.module.scss';

export const CategoryChoosing = ({ categoriesData, onCategorySelect }) => {
	return (
		<ul className={styles.categories}>
			{categoriesData.length > 0 ? (
				categoriesData.map((category, index) => (
					<li
						className={styles.categoriesItem}
						key={index}
						onClick={() => onCategorySelect(category.id)}
					>
						{category.name}
					</li>
				))
			) : (
				<li className={styles.categoriesItem}>
					Категории не найдены. Пожалуйста, создайте категории.
				</li>
			)}
		</ul>
	);
};
