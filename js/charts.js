import { Chart } from '../node_modules/chart.js/auto';
import { getRandomColor } from './utils.js';

let chartInstance = null; // Variable to hold the chart instance
//function to render chart based on cleaned data and visualization type
const renderChart = (canvas, data, visualizationType, indicator, scaleAttributes) => {
    // Check if a chart instance already exists and destroy it
    if (chartInstance) {
        chartInstance.destroy();
    }
    // Create a new chart instance
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: visualizationType,
        data: {
            labels: data.flatMap(item => item.years).reverse(), // Flatten years for x-axis labels
            datasets: data.map(item => ({
                label: item.country,
                data: item.values.map(value => value / scaleAttributes.factor).reverse(), // Scale the values
                fill: false,
                borderColor: getRandomColor(),
                tension: 0.1
            }))
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return value + scaleAttributes.ticker; // Format numbers with commas
                        }
                    }
                }
            },
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

    chartInstance = chart; // Store the chart instance for potential future updates or destruction
    return chart;
};
    
export { renderChart };