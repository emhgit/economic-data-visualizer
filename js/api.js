//TODO: create an api handler to get the data from the world bank api

const API_BASE_URL = "https://api.worldbank.org/v2";
const API_FORMAT = "json";

const fetchData = async (data) => {
    const { countries, indicator, startYear, endYear } = data;
    const url = `${API_BASE_URL}/country/${countries.join(";")}/indicator/${indicator}?date=${startYear}:${endYear}&format=${API_FORMAT}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        return jsonData[1]; // The second element contains the actual data
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export { fetchData };