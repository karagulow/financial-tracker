import styles from './MainPage.module.scss';

import { MainDashboard } from '../../components/MainDashboard';

export const MainPage = () => {
	return (
		<div className={styles.main}>
			<MainDashboard />
		</div>
	);
};
