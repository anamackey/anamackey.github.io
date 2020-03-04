"use strict";
//Weather Site JavaScript Functions

document.addEventListener("DOMContentLoaded", function() {
    //call the modified date function
    // :: buildModDate();
    // work with small screens
    const toggleMenu = document.querySelector("#menuBtn");
    // :: menuButton.addEventListener("click", mobileMenu);
    document.getElementById("primaryNav").classList.toggle("hide");
    //use the wind chill function
    let speed = 25;
    let temp = 10;
    let feelTemp = document.getElementById("feelTemp");
    feelTemp.innerHTML = buildWC(speed, temp);
    //implement the time indicator
    let hour = "10";
    timeIndicator(hour);
    changeSummaryImage("snowy");
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
    document.getElementsByClassName("currentWeather")[0].classList.add(currConditions);
}