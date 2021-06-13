
let inputData = document.querySelector(".search-input");
const btnContainer = $(".past-search-list");
// API variables
const apiKey = "c3dbbcb04a32ec8684f7fd34432569a8";
// storage variables
const storageArray = [];

// variables for current forecast
let locationLatitude;
let locationLongitude;
let currentData;
// variables for five day forecast
let fiveDayData;

const pastBtnCss = "btn btn-outline-success btn-sm text-danger mt-1 d-block";


// function to fetch and display current forecast
const currentForecast = (location) => {
    const apiCurrent = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=" + apiKey;
    fetch(apiCurrent).then((response) => {
        response.json().then((data) => {
            console.log(data)
            // convert date value from api data
            let currentDate = new Date();
            let options = {
                month: "numeric",
                day: "numeric"
            };
            const formattedDate = currentDate.toLocaleDateString("en-US", options);
            currentData = {
                name: data.name,
                date: formattedDate,
                
                temp: data.main.temp + "°F",
                wind: data.wind.speed + " MPH",
                humidity: data.main.humidity + "%",
        
            }
            $("#currentTitle").text(currentData.name + "  (" + formattedDate + ")");
            $("#temp").text("Temp: " + currentData.temp);
            $("#wind").text("Wind: " + currentData.wind);
            $("#humid").text("Humidity: " + currentData.humidity);
            $("#uv").text("UV Index: " + currentData.uv);
            locationLatitude = data.coord.lat;
            locationLongitude = data.coord.lon;
            fiveDayForecast(location, locationLatitude, locationLongitude);
            
        })
    })
};


// function to fetch and display five day forcast
const fiveDayForecast = (location, latitude, longitude) => {
    const apiFiveDay = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=current,minutely,hourly,alerts&appid=" + apiKey;
    fetch(apiFiveDay).then((response) => {
        response.json().then((data) => {
            for(i = 1; i <= 5; i++) {
                fiveDayData = {
                    name: currentData.name,
                    date: data.daily[i].dt,
                    temp: data.daily[i].temp.day + "°F",
                    wind: data.daily[i].wind_speed + " MPH",
                    humid: data.daily[i].humidity + "%",
                }
                const {temp, wind, humid} = fiveDayData;
                // date conversion
                let convertedDate = new Date();
                convertedDate.setDate(convertedDate.getDate() + i);
                const options = { weekday: "long" };
                // display forecast data
                $("#day" + [i]).find("#forecast-date").text(convertedDate.toLocaleDateString("en-US", options));
                $("#day" + [i]).find("#forecast-temp").text(temp);
                $("#day" + [i]).find("#forecast-wind").text(wind);
                $("#day" + [i]).find("#forecast-humidity").text(humid);
            }
            // send location and storage array to be compared to localStorage before storing new entry
            storageArray.push(location);
            saveLocationObj(location, storageArray);
        })
    })
};

// ensure no two of the same locations are stored to localStorage 
const saveLocationObj = (location, storageArray) => {
    localStorage.setItem("weather", JSON.stringify(storageArray));
    const compareStorageArray = () => {
        const storedArray = JSON.parse(localStorage.getItem("weather"));
        const comparedArray = 
        storedArray.filter((item, i, arry) => {
            return arry.indexOf(item) === i;
        })
        localStorage.setItem("weather", JSON.stringify(comparedArray));
    }
    compareStorageArray();
    generatePastBtn(location)
}

const generatePastBtn = () => {
    btnContainer.empty();
    const btnLabel = JSON.parse(localStorage.getItem("weather"));
    btnLabel.forEach((item) => {
        console.log(item)
        btnContainer.
           append($("<li>").
                    text(item).
                    addClass(pastBtnCss).
                    on("click", () => {
                        currentForecast(item)
                    }));
    })
}

// event listeners
$(".search-btn").on("click", (event) => {
    event.preventDefault();
    currentForecast(inputData.value);
    inputData.value = "";
    
});
window.onload = () => generatePastBtn();



