//TODO: add functionality on form submit
import { fetchData } from "./api.js";
import { cleanData } from "./utils.js"; 

const form = document.querySelector("form");
const countriesInput = document.getElementById("countries");
const indicatorsInput = document.getElementById("indicators");
const startYearInput = document.getElementById("start-year");
const endYearInput = document.getElementById("end-year");
const submitButton = document.getElementById("submit-button");

const indicators = {
    GDP: "NY.GDP.MKTP.CD",
}

submitButton.onclick = () => {
    const visualizationInput = document.querySelector("input[name=\"visualization-type\"]:checked");

    //get input values
    const countries = 
        Array.from(countriesInput.options)
        .filter(option => option.selected)
        .map(option => option.value)
        .filter(value => value !== "");
    const indicator = indicatorsInput.value;
    const startYear = startYearInput.value;
    const endYear = endYearInput.value;
    const visualizationType = visualizationInput.value;

    console.log(countries, indicator, startYear, endYear, visualizationType);
    
    //TODO: validate inputs
    if(countries.length === 0 || 
        indicator === "" || 
        startYear === "" || 
        endYear === "" ||
        startYear > endYear ||
        visualizationType === "") {
        alert("Please fill in all fields.");
        return;
    }

    //call app with values
    const data = {
        countries: countries,
        indicator: indicators[indicator] || indicator, // Use the indicator from the map or the input value
        startYear: startYear,
        endYear: endYear
    };

    console.log("Data to fetch:", data);

    const jsonData = 
        fetchData(data)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Error fetching data. Please try again."); 
            return;
        });

    //input api data into chart
    //render chart
}

const getChartData = async (data) => {
    try {
        const response = await fetchData(data);
        if (!response || response.length === 0) {
            throw new Error("No data returned from API.");
        }
        const jsonData = await response.json();

    } catch (error) {
        console.error("Error fetching chart data:", error);
        throw error;
    }
}




