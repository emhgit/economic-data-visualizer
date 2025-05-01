//TODO: add functionality on form submit
//(potentially) utils module to handle the data
const form = document.querySelector("form");
const countriesInput = document.getElementById("countries");
const indicatorsInput = document.getElementById("indicators");
const startYearInput = document.getElementById("start-year");
const endYearInput = document.getElementById("end-year");
const submitButton = document.getElementById("submit-button");

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
    //input api data into chart
    //render chart
}


