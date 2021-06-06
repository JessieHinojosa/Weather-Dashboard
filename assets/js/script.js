
const inputData = document.querySelector(".search-input");
const pastSearchs = $(".past-search-list");
// API variables
const apiKey = "c3dbbcb04a32ec8684f7fd34432569a8";
// storage variables
const storageArray = [];
const locationObj = {};
let locationLatitude;
let locationLongitude;
let currentData;
// variables for five day forecast
let fiveDayData;




// function to fetch and display current forecast
const currentForecast = (location) => {
    const apiCurrent = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=" + apiKey;
    fetch(apiCurrent).then((response) => {
            response.json().then((data) => {
                // console.log(data)
                const date = data.dt;
                // console.log(date)
                currentData = {
                    name: data.name,
                    date: "",
                    temp: data.main.temp,
                    wind: data.wind.speed + " MPH",
                    humidity: data.main.humidity + "%",
                    uv: ""
                }
                $("#currentTitle").text(currentData.name);
                $("#temp").text("Temp: " + currentData.temp);
                $("#wind").text("Wind: " + currentData.wind);
                $("#humid").text("Humidity: " + currentData.humidity);
                $("#uv").text("UV Index: " + currentData.uv);
                locationObj.current = currentData;
                locationLatitude = data.coord.lat;
                locationLongitude = data.coord.lon;
                fiveDayForecast(inputData.value, locationLatitude, locationLongitude);
            })
        })
};

// function to fetch and display five day forcast
const fiveDayForecast = (location, latitude, longitude) => {
    const apiFiveDay = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=current,minutely,hourly,alerts&appid=" + apiKey;
    fetch(apiFiveDay).then((response) => {
        response.json().then((data) => {
           console.log(data)
           for(i = 1; i <= 5; i++) {
           fiveDayData = {
               name: location,
               date: data.daily[i].dt,
               temp: data.daily[i].temp.day,
               wind: data.daily[i].wind_speed + " MPH",
               humid: data.daily[i].humidity + "%",
               uv: data.daily[i].uvi
           }
        //  display data
        const forecastCard = $("#day" + [i]);
        forecastCard.append($("<li>").text(fiveDayData.name).
                     append($("<li>").text(fiveDayData.temp).
                     append($("<li>").text(fiveDayData.wind).
                     append($("<li>").text(fiveDayData.humid).
                     append($("<li>").text(fiveDayData.uv))))));
           }
        })
    })
};


// function to save and load the location object that contains current and five day forecast 
const saveLocationObj = () => {
    const storageObj = JSON.stringify(locationObj);
    localStorage.setItem("weather", storageObj);
}
const loadPage = () => {

}

// event listeners
$(".search-btn").on("click", (event) => {
    event.preventDefault();
    currentForecast(inputData.value);
    setTimeout(saveLocationObj, 1000);
    inputData.value = "";
    
});
pastSearchs.on("click", (event) => {
    event.preventDefault();
    
})
document.addEventListener("load", () => {
    localStorage.getItem("item");

})

