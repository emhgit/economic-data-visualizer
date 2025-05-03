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
    
    const chartData = getChartData(data, visualizationType, scaleAttributes, indicator);
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: visualizationType,
        data: {
            labels: chartData.labels, // Flatten years for x-axis labels
            datasets: chartData.datasets
        },
        options: chartData.options
    });

    chartInstance = chart; // Store the chart instance for potential future updates or destruction
    return chart;
};

function getChartData(data, visualizationType, scaleAttributes, indicator) {
    const defaultOptions = {
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
    };

    const pieOrDonutOptions = {
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: `${indicator} for Countries by Year` 
            }
        }
    };

    switch (visualizationType) {
        case "scatter":
            const scatterXData = [...new Set(data.flatMap(item => item.years))].reverse();
            const scatterYData = data.map(item => ({
                label: item.country,
                data: item.values.map((value, index) => ({
                    x: item.years[index],
                    y: value / scaleAttributes.factor
                })).reverse(),
                fill: false,
                borderColor: getRandomColor(),
                tension: 0.1
            }));
            return { labels: scatterXData, datasets: scatterYData, options: defaultOptions };
        
        case "pie":
            // pieXData logic to be added later
            const pieXData = data.flatMap(item => item.country);
            const latestIdx = data[0].values.length - 1;
            const pieData = data.map(item => item.values[latestIdx] / scaleAttributes.factor);
          
            return { 
                labels: pieXData, 
                datasets: [{
                    data: pieData,
                    fill: true,
                    backgroundColor: data.map(() => getRandomColor()),
                    tension: 0.1
                }],
                options: pieOrDonutOptions
            };

        case "doughnut":
            // pieXData logic to be added later
            const donutXData = data.flatMap(item => item.country);
            const latestDonutIdx = data[0].values.length - 1;
            const donutData = data.map(item => item.values[latestDonutIdx] / scaleAttributes.factor);
            
            return { 
                labels: donutXData, 
                datasets: [{
                    data: donutData,
                    fill: true,
                    backgroundColor: data.map(() => getRandomColor()),
                    tension: 0.1
                }],
                options: pieOrDonutOptions
            };
            
        default:
            const defaultXData = [...new Set(data.flatMap(item => item.years))].reverse();
            const defaultYData = data.map(item => ({
                label: item.country,
                data: item.values
                .map(value => value / scaleAttributes.factor)
                .reverse(),
                fill: false,
                borderColor: getRandomColor(),
                tension: 0.1
            }));
            return { labels: defaultXData, datasets: defaultYData, options: defaultOptions };
    }
}


/*TODO: 
attempt multiple countries x
fix double conversion for years; x
fix pie chart;
create indicators.json;
//improve ui: type and dropdown for large option inputs, coloring, spacing, font changes, etc
*/
export { renderChart };