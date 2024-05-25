import styles from './MainPage.module.scss';

import { MainDashboard } from '../../components/MainDashboard';
import { CategoriesDashboard } from '../../components/CategoriesDashboard';

export const MainPage = () => {
	return (
		<div className={styles.main}>
			<MainDashboard />
			<CategoriesDashboard transactionsType={'income'} />
			<CategoriesDashboard transactionsType={'expenses'} />
		</div>
	);
};
