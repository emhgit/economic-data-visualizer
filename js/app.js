//TODO: add functionality on form submit
//(potentially) utils module to handle the data
const form = document.querySelector("form");
const countriesInput = document.getElementById("countries");
const indicatorsInput = document.getElementById("indicators");
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");
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
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const visualizationType = visualizationInput.value;

    console.log(countries, indicator, startDate, endDate, visualizationType);
    
    //TODO: validate inputs
    //call app with values
    //input api data into chart
    //render chart
}


