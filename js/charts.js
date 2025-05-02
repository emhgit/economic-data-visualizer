import { Chart } from '../node_modules/chart.js/auto';
import { getRandomColor } from './utils.js';

let chartInstance = null; // Variable to hold the chart instance
//function to render chart based on cleaned data and visualization type
const renderChart = (canvas, data, visualizationType, indicator, scaleAttributes) => {
    // Check if a chart instance already exists and destroy it
    if (chartInstance) {
        chartInstance.destroy();
        console.log("Chart instance destroyed.");
    }
    // Create a new chart instance
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: visualizationType,
        data: {
            labels: [...new Set(data.flatMap(item => item.years))].reverse(), // Flatten years for x-axis labels
            datasets: data.map(item => ({
                label: item.country,
                data: getChartData(item, visualizationType, scaleAttributes), // Scale the values
                fill: false,
                borderColor: getRandomColor(),
                tension: 0.1
            }))
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category', // Use linear scale for years
                    title: {
                        display: true,
                        text: 'Year'
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "US Dollars"
                    },
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

function getChartData(item, visualizationType, scaleAttributes) {
    switch (visualizationType) {
        case "scatter":
            const scatterData = item.values.map((value, index) => ({ x: item.years[index], y: value / scaleAttributes.factor })).reverse();
            console.log("Rendering scatter chart", scatterData);
            return scatterData;
        default:
            return item.values.map(value => value / scaleAttributes.factor).reverse(); // Scale the values for readability
    }
}

/*TODO: 
fix double conversion for years; x
fix api call values; 
attempt multiple countries x
use CSS for styling; 
*/
export { renderChart };