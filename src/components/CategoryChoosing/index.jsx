import styles from './CategoryChoosing.module.scss';

export const CategoryChoosing = ({ categoriesData }) => {
	return (
		<ul className={styles.categories}>
			{categoriesData.map((data, index) => (
				<li className={styles.categoriesItem} key={index}>
					{data}
				</li>
			))}
		</ul>
	);
};
