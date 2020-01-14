let daynames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",

];

let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

let d = new Date();
let dayName = daynames[d.getDay()];
let monthName = months[d.getMonth()];
d.getFullYear();


let fulldate = dayName + ", " + monthName + " " + d.getDate()+", " + year;

document.getElementById("currentdate").textContent = fullDate;




