"use strict";
//Weather Site JavaScript Functions
//
var pageNav = document.querySelector('#page-nav');
var statusContainer = document.querySelector('#status');
var contentContainer = document.querySelector('#main-content');
//
var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
// local and session storage variable
var locStore = window.localStorage;
var sessStore = window.sessionStorage;


document.addEventListener("DOMContentLoaded", function() {
    //call the modified date function
    // :: buildModDate();
    // work with small screens
    const toggleMenu = document.querySelector("#menuBtn");
    // :: menuButton.addEventListener("click", mobileMenu);
    document.getElementById("primaryNav").classList.toggle("hide");
    //use the wind chill function
    //let speed = 25;
    //let temp = 10;
    //let feelTemp = document.getElementById("feelTemp");
    //feelTemp.innerHTML = buildWC(speed, temp);
    //implement the time indicator
    //let hour = "10";
    //timeIndicator(hour);
    //changeSummaryImage("snowy");

    //Get weather json data
    let weatherURL = "/weather/js/idahoweather.json";
    fetchWeatherData(weatherURL);
    buildPage();
});


console.log("my javascript is being read.");
//test to see if Javascript is being read



var x = document.lastModified;
document.getElementById("demo").innerHTML = x;
//for Last Updated text at bottom of webpage





//handles small screen menu

// function toggleMenu(toggleMenu) {
//     toggleMenu.toggle("hide");
// }

//for pop up menu on nav

//compute the windchill
function buildWC(speed, temp) {
    //let feelTemp = document.getElementById("feelTemp");
    let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed,
        0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
    console.log(wc);

    //round the answer down to integer
    wc = Math.floor(wc);

    //If chill is greater than temp, return the temp
    wc = (wc > temp) ? temp : wc;

    //display the windchill
    console.log(wc);

    //wc = "feels like "+wc+"F";
    //feelTemp.innerHTML = wc;
    return wc;
}

//implements the Time indicator

function timeIndicator(hour) {
    //find all classes of ball and remove them 
    let x = document.querySelectorAll(".slider");
    for (let item of x) {
        console.log("THIS IS A TEST" + item.id);
        item.classList.remove("slider");
    }
    let newHour = parseFloat(hour) + 1;
    console.log(".i" + newHour)
    ''
    //find all matching hours and add ball class
    let hr = document.querySelectorAll(".i" + (newHour));
    for (let item of hr) {
        item.classList.add("slider");
    }
}

/*handle weather summary background image*/

function changeSummaryImage(currConditions) {
    //document.getElementsByClassName("currentWeather")[0].classList.add(currConditions);
}



/* *************************************
 *  Fetch Weather Data
 ************************************* */
function fetchWeatherData(weatherURL) {
    let cityName = document.querySelector('body').getAttribute('data-city'); // The data we want from the weather.json file
    fetch(weatherURL)
        .then(function(response) {
            if (response.ok) {
                let data = response.json();
                return data;
            }
            throw new ERROR('Network response was not OK.');
        })
        .then(function(data) {
            // Check the data object that was retrieved
            console.log(data);
            // data is the full JavaScript object, but we only want the preston part
            // shorten the variable and focus only on the data we want to reduce typing
            let p = data[cityName];

            // **********  Get the location information  **********
            let locName = p.properties.relativeLocation.properties.city;
            let locState = p.properties.relativeLocation.properties.state;
            // Put them together
            let fullName = locName + ', ' + locState;
            // See if it worked, using ticks around the content in the log
            console.log(`fullName is: ${fullName}`);
            // Get the longitude and latitude and combine them to
            // a comma separated single string
            const latLong = p.properties.relativeLocation.geometry.coordinates[1] + "," + p.properties.relativeLocation.geometry.coordinates[0];
            console.log(latLong);

            // Create a JSON object containing the full name, latitude and longitude
            // and store it into local storage.
            const prestonData = JSON.stringify({ fullName, latLong });
            locStore.setItem("Preston,ID", prestonData);




            // **********  Get the current conditions information  **********

            // As the data is extracted from the JSON, store it into session storage
            sessStore.setItem("fullName", fullName);
            sessStore.setItem("latLong", latLong);

            // Get the temperature data
            let highTemp = p.properties.relativeLocation.properties.highTemp;
            let lowTemp = p.properties.relativeLocation.properties.lowTemp;
            sessStore.setItem("highTemp", highTemp);
            sessStore.setItem("lowTemp", lowTemp);


            // Get the wind data 
            let windSpeed = p.properties.relativeLocation.properties.windSpeed;
            let windGust = p.properties.relativeLocation.properties.windGust;
            sessStore.setItem("windSpeed", windSpeed);
            sessStore.setItem("windGust", windGust);


            // Get the hourly data using another function - should include the forecast temp, condition icons and wind speeds. The data will be stored into session storage.
            getHourly(p.properties.forecastHourly);
        })
        .catch(function(error) {
            console.log('There was a fetch problem: ', error.message);
            statusContainer.innerHTML = 'Sorry, the data could not be processed.';
        })
}




/* ************************************
 *  Get Hourly Forecast data
 ************************************* */
function getHourly(URL) {
    fetch(URL)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new ERROR('Response not OK.');
        })
        .then(function(data) {
            console.log('Data from getHourly function:');
            console.log(data); // Let's see what we got back

            // Store 12 hours of data to session storage  
            var hourData = [];
            let todayDate = new Date();
            var nowHour = todayDate.getHours();
            console.log(`nowHour is ${nowHour}`);
            for (let i = 0, x = 11; i <= x; i++) {
                if (nowHour < 24) {
                    hourData[nowHour] = data.properties.periods[i].temperature + "," + data.properties.periods[i].windSpeed + "," + data.properties.periods[i].icon;
                    sessStore.setItem(`hour${nowHour}`, hourData[nowHour]);
                    nowHour++;
                } else {
                    nowHour = nowHour - 12;
                    hourData[nowHour] = data.properties.periods[i].temperature + "," + data.properties.periods[i].windSpeed + "," + data.properties.periods[i].icon;
                    sessStore.setItem(`hour${nowHour}`, hourData[nowHour]);
                    nowHour = 1;
                }
            }

            // Get the shortForecast value from the first hour (the current hour)

            // This will be the condition keyword for setting the background image
            sessStore.setItem('shortForecast', data.properties.periods[0].shortForecast);

            // Call the buildPage function

        })
        .catch(error => console.log('There was a getHourly error: ', error))

}

/* ************************************
 *  Build the Weather page
 ************************************* */
function buildPage() {

    // Set the title with the location name at the first
    // Gets the title element so it can be worked with
    let pageTitle = document.querySelector('#title-content');
    // Create a text node containing the full name 
    let fullNameNode = document.createTextNode(sessStore.getItem('fullName'));
    // inserts the fullName value before any other content that might exist
    pageTitle.insertBefore(fullNameNode, pageTitle.childNodes[0]);
    // When this is done the title should look something like this:
    // Preston, Idaho | The Weather Site                    

    // Get the h1 to display the city location
    let contentHeading = document.querySelector('#content-heading');
    contentHeading.innerHTML = sessStore.getItem('fullName');
    // The h1 in the main element should now say "Preston, Idaho"

    // Get the coordinates container for the location
    let latLon = document.querySelector('#lat-lon');
    latLon.innerHTML = sessStore.getItem('lat-lon');
    // The latitude and longitude should match what was stored in session storage.

    // Get the condition keyword and set Background picture
    changeSummaryImage(sessStore.getItem('shortForecast'));
    /* Keep in mind that the value may be different than 
    what you need for your CSS to replace the image. You 
    may need to make some adaptations for it to work.*/

    // **********  Set the current conditions information  **********

    // Set the temperature information
    let highTemp = $('#hiTemp');
    let loTemp = $('#loTemp');
    let currentTemp = $('#currentTemp');
    let feelTemp = $('#feelTemp');
    highTemp.innerHTML = sessStore.getItem('highTemp') + "°F";
    loTemp.innerHTML = sessStore.getItem('lowTemp') + "°F";
    currentTemp.innerHTML = sessStore.getItem('temperature') + "°F";
    // Set the wind information
    let speed = $('#speed');
    let gust = $('#gusting');
    speed.innerHTML = sessStore.getItem('windSpeed');
    gust.innerHTML = sessStore.getItem('windGust');
    // Calculate feel like temp
    feelTemp.innerHTML = buildWC(sessStore.getItem('windSpeed'), sessStore.getItem('temperature')) + "°F";

    // **********  Set the Time Indicators  **********
    let thisDate = new Date();
    var currentHour = thisDate.getHours();
    let indicatorHour;
    // If hour is greater than 12, subtract 12
    if (currentHour > 12) {
        indicatorHour = currentHour - 12;
    } else {
        indicatorHour = currentHour;
    };
    console.log(`Current hour in time indicator is: ${currentHour}`);
    // Set the time indicator
    timeIndicator(indicatorHour);

    // ********** Hourly Temperature Component  **********

    // Get the hourly data from storage as an array
    let currentData = [];
    let tempHour = currentHour;
    // Adjust counter based on current time
    for (let i = 0, x = 12; i < x; i++) {
        if (tempHour <= 23) {
            currentData[i] = sessStore.getItem('hour' + tempHour).split(",");
            tempHour++;
        } else {
            tempHour = tempHour - 12;
            currentData[i] = sessStore.getItem('hour' + tempHour).split(",");
            console.log(`CurrentData[i][0] is: ${currentData[i][0]}`);
            tempHour = 1;
        }
    }
    console.log(currentData);

    // Loop through array inserting data
    // Start with the outer container that matchs the current time
    tempHour = currentHour;
    for (let i = 0, x = 12; i < x; i++) {
        if (tempHour >= 13) {
            tempHour = tempHour - 12;
        }
        console.log(`Start container is: #temps o.${tempHour}`);
        $('#temps .o' + tempHour).innerHTML = currentData[i][0];
        tempHour++;
    }
    // ********** Hourly Wind Component  **********

    // Get the hourly data from storage
    let windArray = [];
    let windHour = currentHour;
    // Adjust counter based on current time
    for (let i = 0, x = 12; i < x; i++) {
        if (windHour <= 23) {
            windArray[i] = currentData[i][1].split(" ");
            console.log(`windArray[i] is: ${windArray[i]}`);
            windHour++;
        } else {
            windHour = windHour - 12;
            windArray[i] = currentData[i][1].split(" ");
            windHour = 1;
        }
    }
    console.log(windArray);

    // Insert Wind data
    // Start with the outer container that matchs the time indicator
    windHour = currentHour;
    for (let i = 0, x = 12; i < x; i++) {
        if (windHour >= 13) {
            windHour = windHour - 12;
        }
        $('#winds .o' + windHour).innerHTML = windArray[i][0];
        windHour++;
    }


    // ********** Hourly Conditions Component  **********

    let conditionHour = currentHour;
    // Adjust counter based on current time
    for (let i = 0, x = 12; i < x; i++) {
        if (conditionHour >= 13) {
            conditionHour = conditionHour - 12;
        }
        $('#condition .o' + conditionHour).innerHTML = '<img src="' + currentData[i][2] + '" alt="hourly weather condition image">';
        conditionHour++;
    }

    // Change the status of the containers
    contentContainer.setAttribute('class', ''); // removes the hide class from main
    statusContainer.setAttribute('class', 'hide'); // hides the status container


}