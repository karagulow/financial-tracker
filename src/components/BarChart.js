import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export const BarChart = ({ chartData }) => {
	const options = {
		scales: {
			y: {
				ticks: {
					callback: function (value) {
						return `${value.toLocaleString()} ₽`;
					},
				},
			},
		},
		plugins: {
			tooltip: {
				callbacks: {
					label: function (context) {
						let label = context.dataset.label || '';
						if (label) {
							label += ': ';
						}
						label += `${context.raw.toLocaleString()} ₽`;
						return label;
					},
				},
			},
		},
	};

	if (!chartData || !chartData.labels) {
		return <div>Loading...</div>;
	}

	return <Bar data={chartData} options={options} />;
};
