//function to clean the data from the world bank api
const cleanData = data  => {
    //check if data is an array and has elements
    if (!Array.isArray(data) || data.length === 0) {
        console.error("Invalid data format or empty data array.");
        return [];
    }
    //map through the data and return an array of objects with the desired properties
    return data.map(item => {
        if (!item || !item.country || !item.country.value || !item.date || !item.value || item.value === null || item.value === undefined) {
            console.warn("Skipping invalid item:", item);
            return null; // Skip invalid items
        }
        return {
            country: item.country.value,
            date: item.date,
            value: item.value
        };
    }).filter(item => item !== null); // Filter out any null items
}

//create function to format the data for the chart
const getRandomColor = () => {
    const randomR = Math.floor(Math.random() * 256);
    const randomG = Math.floor(Math.random() * 256);   
    const randomB = Math.floor(Math.random() * 256);
    return `rgb(${randomR}, ${randomG}, ${randomB})`;
}

//TODO: create functions to group inputs into distinct country objects and scale values

export { cleanData, getRandomColor };