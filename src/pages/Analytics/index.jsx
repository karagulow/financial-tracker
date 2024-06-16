import styles from './Analytics.module.scss';
import { ChartBlock } from '../../components/ChartBlock';

export const Analytics = () => {
	return (
		<div className={styles.main}>
			<ChartBlock chartName='Доходы и расходы' chartType='line' />
			<ChartBlock chartName='Сальдо' chartType='line' />
			<ChartBlock
				chartName='Доходы'
				chartType='bar'
				transactionType='33a63784-26fb-4b02-a800-93e46c519548'
			/>
			<ChartBlock
				chartName='Расходы'
				chartType='bar'
				transactionType='4321d5a4-f17d-43a1-9702-9f222e9a7cd9'
			/>
			<ChartBlock
				chartName='Прогнозирование доходов и расходов'
				chartType='line'
			/>
		</div>
	);
};
