const API_BASE_URL = "https://api.worldbank.org/v2";
const API_FORMAT = "json";

//api handler to get the data from the world bank api
const fetchData = async (data) => {
    let { countries, indicator, startYear, endYear } = data;
    /*
    if(startYear === endYear){
        startYear += "Q1";
        endYear += "Q4";
    }*/
    const url = `${API_BASE_URL}/country/${countries.join(";")}/indicator/${indicator}?date=${startYear}:${endYear}&format=${API_FORMAT}`;
    console.log("Fetching data from URL:", url);
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

/*const mockData = {
    "countries": ["USA", "CAN"],
    "indicator": "NY.GDP.MKTP.CD",
    "startYear": "2010",
    "endYear": "2020"
}

const response = fetchData(mockData)
    .then(data => {
        console.log("Fetched data:", data);
        return data;
    })
    .catch(error => {
        console.error("Error in mock data fetch:", error);
    });
*/

export { fetchData };