import { fetchData } from "./api.js";
import { cleanData, groupData, getScaleAttributes } from "./utils.js"; 
import { renderChart } from "./charts.js"; 
import Choices from "../node_modules/choices.js/";
import "../node_modules/choices.js/public/assets/styles/choices.min.css";

const canvas = document.querySelector("canvas");
const countriesInput = document.getElementById("countries");
const indicatorsInput = document.getElementById("indicators");
const startYearInput = document.getElementById("start-year");
const endYearInput = document.getElementById("end-year");
const submitButton = document.getElementById("submit-button");

const indicators = {
    "GDP (current US$)": "NY.GDP.MKTP.CD",
    "GDP growth (annual %)": "NY.GDP.MKTP.KD.ZG",
    "Inflation, consumer prices (annual %)" : "FP.CPI.TOTL.ZG",
    "Unemployment, total (% of total labor force)": "SL.UEM.TOTL.ZS",
    "General government gross debt, total (% of GDP)": "GC.DOD.TOTL.GD.ZS",
}

const renderCountriesInput = () => {
    fetch("../data/countries.json")
    .then(response => response.json())
    .then(data => { 
        data.countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country.code;
            option.textContent = country.name;
            countriesInput.appendChild(option);
        });
    
        const countriesChoices = new Choices(countriesInput, {
            removeItemButton: true,
            searchEnabled: true,
        });
    })
    .catch(error => {
        console.error("Error fetching countries data:", error);
        alert("An error occurred while loading countries. Please try again later.");
    })
}

renderCountriesInput();

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

    //validate inputs
    if(countries.length === 0 || 
        indicator === "" || 
        startYear === "" || 
        endYear === "" ||
        visualizationType === "") {
        alert("Please fill in all fields.");
        return;
    }
    else if (startYear > endYear || startYear < 1960 || endYear < 1960 || startYear > 2025 || endYear > 2025){
        alert("Invalid year format");
        return;
    }

    //call api with data 
    const data = {
        countries: countries,
        indicator: indicators[indicator] || indicator, // Use the indicator from the map or the input value
        startYear: startYear,
        endYear: endYear
    };

    console.log("Data to fetch:", data);

    getData(data)
    .then(cleanedData => {
        console.log("Cleaned Data:", cleanedData);
        const groupedData = groupData(cleanedData);
        console.log("Grouped Data:", groupedData);
        const scaleAttributes = getScaleAttributes(groupedData);
        //render the chart with cleanedData
        renderChart(canvas, groupedData, visualizationType, indicator, scaleAttributes);
    })
    .catch(error => {
        console.error("Error fetching chart data:", error);
        alert("An error occurred while fetching the data. Please try again.");
     });
}

const getData = async (data) => {
    try {
        const response = await fetchData(data);
      
        if (!Array.isArray(response) || response.length === 0 || !response) {
            throw new Error("No data returned from API.");
        }

        //clean the data
        const cleanedData = cleanData(response);

        if (cleanedData.length === 0 || cleanedData === undefined) {
            throw new Error("No valid data found after cleaning.");
        }
        return cleanedData;
    } catch (error) {
        console.error("Error fetching chart data:", error);
        throw error;
    }
};