import { Chart } from '../node_modules/chart.js/auto';
import { getRandomColor } from './utils.js';

//function to render chart based on cleaned data and visualization type
const renderChart = (canvas, data, visualizationType, indicator) => {
    // Create a new chart instance
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: visualizationType,
        data: {
            labels: data.map(item => item.date),
            datasets: data.map(item => ({
                label: item.country,
                data: item.value / 1000000,
                fill: false,
                borderColor: getRandomColor(),
                tension: 0.1
            }))
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: `${indicator} for Countries by Year` 
                }
            }
        }
    });

    return chart;
};
    
export { renderChart };