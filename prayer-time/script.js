let dateObj = new Date();
let currentMonth = dateObj.getMonth() + 1;
let today = dateObj.getDate();
let year = dateObj.getFullYear();
let fullMonthObj = null;
let monthName = new Date().toLocaleString("en-us", { month: "long" });
let selectedLocation = "dubai" || "";

window.onload = () => {
    'use strict';
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('sw.js');
    }
}

var getDaysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
};

function fetchDatesToday(city) {
    fetch(`https://dmu-api.gulfnews.com/prayer-times/manage/public/api/prayertimings?country=united_arab_emirates&city=${city}&month=${currentMonth}`)
        .then((response) => {
            return response.json();
        })
        .then((jsonObject) => {
            let todayTiming = jsonObject[`date${today}`];
            document.querySelector('.container .prayer-values').innerHTML = `<div>${todayTiming.fajr}</div><div>${todayTiming.dhuhr}</div><div>${todayTiming.asr}</div><div>${todayTiming.maghrib}</div><div>${todayTiming.isha}</div>`;
            document.querySelector('.date').innerHTML = `<span>${todayTiming.week_day}, ${today} - ${monthName} / ${year}</span><span class="hijri">${todayTiming.hijri_month} - ${todayTiming.hijri_day}</span>`;
        })
        .catch((error) => {
            document.write(error);
        });
}

function fetchMonthDates(city, monthNumber) {
    fetch(`https://dmu-api.gulfnews.com/prayer-times/manage/public/api/prayertimings?country=united_arab_emirates&city=${city}&month=${monthNumber}`)
        .then((response) => {
            return response.json();
        })
        .then((jsonObject) => {
            fullMonthObj = jsonObject;
            let totalDays = getDaysInMonth(fullMonthObj.month, fullMonthObj.year);
            document.querySelector('.monthview-monthname .month-year').innerHTML = `${year}`;
            document.querySelector('.monthview .prayer-month-time').innerHTML = "";
            for (i = 1; i <= totalDays; i++) {
                if(i >= today) {
                    if (i === today && monthNumber == currentMonth) {
                        document.querySelector('.monthview .prayer-month-time').innerHTML += `<div class="highlight">${i}</div><div class="highlight">${fullMonthObj[`date${i}`].fajr}</div><div class="highlight">${fullMonthObj[`date${i}`].dhuhr}</div><div class="highlight">${fullMonthObj[`date${i}`].asr}</div><div class="highlight">${fullMonthObj[`date${i}`].maghrib}</div><div class="highlight">${fullMonthObj[`date${i}`].isha}</div>`;
                    } else {
                        document.querySelector('.monthview .prayer-month-time').innerHTML += `<div>${i}</div><div>${fullMonthObj[`date${i}`].fajr}</div><div>${fullMonthObj[`date${i}`].dhuhr}</div><div>${fullMonthObj[`date${i}`].asr}</div><div>${fullMonthObj[`date${i}`].maghrib}</div><div>${fullMonthObj[`date${i}`].isha}</div>`;
                    }
                }
            }
        })
        .catch((error) => {
            document.write(error);
        });
}

let selectEl = document.querySelector('#location');
selectEl.addEventListener('change', function (e) {
    let getLocation = e.target.selectedOptions[0].value;
    selectedLocation = getLocation;
    fetchDatesToday(getLocation);
    fetchMonthDates(getLocation, currentMonth);
})


document.querySelector('#selectMonth').addEventListener('change', function (e) {
    let getSelectedMonth = e.target.selectedOptions[0].value;
    fetchMonthDates(selectedLocation, getSelectedMonth);
    document.querySelector('.monthview').scrollIntoView({behavior: "smooth", block: "start"});
});

fetchDatesToday("dubai");
fetchMonthDates("dubai", currentMonth);
document.querySelector('#selectMonth').options[currentMonth - 1].selected = "selected";
