// Uses Choices-js (MIT License)
// https://github.com/Choices-js/Choices
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

const renderCountriesInput = () => {
  fetch("../data/countries.json")
    .then((response) => response.json())
    .then((data) => {
      data.countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.code;
        option.textContent = country.name;
        countriesInput.appendChild(option);
      });

      new Choices(countriesInput, {
        removeItemButton: true,
        searchEnabled: true,
      });
    })
    .catch((error) => {
      console.error("Error fetching countries data:", error);
      alert(
        "An error occurred while loading countries. Please try again later."
      );
    });
};

const renderIndicatorsInput = () => {
  fetch("../data/indicators.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((indicator) => {
        const option = document.createElement("option");
        option.value = indicator.code;
        option.innerText = indicator.name;
        option.setAttribute("name", indicator.name);
        indicatorsInput.appendChild(option);
      });

      new Choices(indicatorsInput, {
        removeItemButton: true,
        searchEnabled: true,
      });
    })
    .catch((error) => {
      console.error("Error fetching indicator data:", error);
      alert(
        "An error occurred while loading indicators. Please try again later."
      );
    });
};

renderCountriesInput();
renderIndicatorsInput();

submitButton.onclick = () => {
  const visualizationInput = document.querySelector(
    'input[name="visualization-type"]:checked'
  );

  //get input values
  const countries = Array.from(countriesInput.options)
    .filter((option) => option.selected)
    .map((option) => option.value)
    .filter((value) => value !== "");
  const indicatorCode = indicatorsInput.value;
  const selectedOption = [...indicatorsInput.options].find(
    (opt) => opt.value === indicatorCode
  );
  const indicatorName = selectedOption.getAttribute("name");
  const startYear = startYearInput.value;
  const endYear = endYearInput.value;
  const visualizationType = visualizationInput.value;

  //validate inputs
  if (
    countries.length === 0 ||
    indicatorCode === "" ||
    indicatorName === "" ||
    startYear === "" ||
    endYear === "" ||
    visualizationType === ""
  ) {
    alert("Please fill in all fields.");
    return;
  } else if (
    startYear > endYear ||
    startYear < 1960 ||
    endYear < 1960 ||
    startYear > 2025 ||
    endYear > 2025
  ) {
    alert("Invalid year format");
    return;
  }

  //call api with data
  const data = {
    countries: countries,
    indicator: indicatorCode, // Use the indicator from the map or the input value
    startYear: startYear,
    endYear: endYear,
  };

  getData(data)
    .then((cleanedData) => {
      console.log("Data successfully cleaned");
      const groupedData = groupData(cleanedData);
      console.log("Data successsfully grouped");
      const scaleAttributes = getScaleAttributes(groupedData);
      //render the chart with cleanedData
      renderChart(
        canvas,
        groupedData,
        visualizationType,
        indicatorName,
        scaleAttributes
      );
    })
    .catch((error) => {
      console.error("Error fetching chart data:", error);
      alert("An error occurred while fetching the data. Please try again.");
    });
};

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
