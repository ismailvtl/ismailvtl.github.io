let dateObj = new Date();
let today = dateObj.getDate();
let time = dateObj.getHours();
let currentTime = `${dateObj.getHours() % 12}:${dateObj.getMinutes()}`;
let currentMonth = dateObj.getMonth() + 1;
let monthNames = ["Janurary", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var getDaysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
};
let todayObj = null;
let prayerObj = null;
let selectedLocation = localStorage.getItem("prayerLocation") || "dubai";
let farjEl = document.querySelector('.item.fajr .prayer-time');
let dhuhrEl = document.querySelector('.item.dhuhr .prayer-time');
let asrEl = document.querySelector('.item.asr .prayer-time');
let maghribEl = document.querySelector('.item.maghrib .prayer-time');
let ishaEl = document.querySelector('.item.isha .prayer-time');
let sunRiseEl = document.querySelector('.sunrise .sunrise-time');
let localtionEl = document.querySelector('.locationEl');
let dayDateEl = document.querySelector('.day-date');
let monthYearEl = document.querySelector('.month-year');
let hijridayEl = document.querySelector('.hijriday');
let drawerMonthYear = document.querySelector('.monthDetails');
let overLay = document.querySelector('.overlay');
let closeBtn = document.querySelector('.close');
let tempYear = null;
let tempMonth = null;


function fetchPrayerDays(location) {
    fetch(`/${location}/${dateObj.getFullYear()}/${dateObj.getMonth()+1}/prayertimings.json`)
    .then(function(response) {
        return response.json();
    })
    .then(function(json){                
        let totalDays = getDaysInMonth(json.month, json.year);
        let todayTiming = json[`date${today}`];
        prayerObj = json;
        todayObj = todayTiming;
        farjEl.textContent = todayTiming.fajr;
        dhuhrEl.textContent = todayTiming.dhuhr;
        asrEl.textContent = todayTiming.asr;
        maghribEl.textContent = todayTiming.maghrib;
        ishaEl.textContent = todayTiming.isha;
        localtionEl.textContent = json.city;
        dayDateEl.textContent = todayTiming.week_day + ', ' + todayTiming.day;
        monthYearEl.textContent = monthNames[json.month -  1].slice(0, 3) + ' ' + json.year;
        hijridayEl.textContent = todayTiming.hijri_month + ' - ' + todayTiming.hijri_day;
        sunRiseEl.textContent = `${todayTiming.sunrise}`;
        drawerMonthYear.textContent = monthNames[json.month -  1] + ' ' + json.year;
        document.querySelector(`.drawer .month-inner`).innerHTML = "";
        for(i=1;i<=totalDays;i++) {
                document.querySelector(`.drawer .month-inner`).innerHTML += `<div class="values day${i}">
                <div>${i}</div><div>${json[`date${i}`].fajr}</div><div>${json[`date${i}`].dhuhr}</div><div>${json[`date${i}`].asr}</div><div>${json[`date${i}`].maghrib}</div><div>${json[`date${i}`].isha}</div>
                </div>`;
        }
    })
}

fetchPrayerDays(selectedLocation);


document.querySelector('.dots').addEventListener('click', function(){
    document.querySelector('body').classList.add('options-opened');
    overLay.style.display = "block";
});

document.querySelector('.location').addEventListener('click', function(){
    document.querySelector('#loader').style.display = "none";
    document.querySelector('#changeCityCTA').click();
});

document.querySelector('.date').addEventListener('click', function(){
    highlightCurrentMonthRow();
    document.querySelector('#monthView').classList.add('active');
    overLay.style.display = "block";
    setTimeout(function(){
        closeBtn.style.display = "block";
        document.querySelector('.todayRow').scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    }, 400)
});


document.querySelector('#changeCityCTA').addEventListener('click', function(){
    document.querySelector('#locationSelection').classList.add('active');
    document.querySelector('body').classList.remove('options-opened');
    overLay.style.display = "none";
    document.querySelector('#loader').style.display = "none";
    setTimeout(function(){
        closeBtn.style.display = "block";
    }, 400);
    document.querySelectorAll('#locationSelection .list-items ul button').forEach(function(button){
        button.classList.remove("selected");
    });
    document.querySelector(`#locationSelection .list-items ul button[data-val="${localStorage.getItem("prayerLocation") || "dubai"}"]`).classList.add('selected');
});


document.querySelector('#feedbackCTA').addEventListener('click', function(){
    document.querySelector('#bugReport').classList.add('active');
    document.querySelector('body').classList.remove('options-opened');
    overLay.style.display = "none";
    setTimeout(function(){
        closeBtn.style.display = "block";
    }, 400);
});



overLay.addEventListener('click', function(){
    document.querySelectorAll('.drawer').forEach(function(item){
        item.classList.remove('active');
    })
    overLay.style.display = "none";
    closeBtn.style.display = "none";
    document.querySelector('body').classList.remove('options-opened');
});


closeBtn.addEventListener('click', function(){
    document.querySelector('.overlay').click();
});


function highlightCurrentMonthRow() {
    let currentDay = document.querySelector(`.day${dateObj.getDate()}`);
    if(currentDay) {
        currentDay.classList.add('todayRow');
    }
}


document.querySelectorAll('#locationSelection .list-items ul button').forEach(function(button){
button.addEventListener('click', function(e){
    let getLocation = e.target.getAttribute('data-val');
    localStorage.setItem("prayerLocation", getLocation);
    document.querySelector('.overlay').click();
    fetchPrayerDays(getLocation);
});
})


document.querySelectorAll('#yearSelection .list-items ul button').forEach(function(button){
    button.addEventListener('click', function(e){
        let getSelectedYear = e.target.getAttribute('data-val');
        document.querySelector('.overlay').click();
        tempYear = getSelectedYear;
        document.querySelector('.year-link-text').textContent = tempYear;
        document.querySelector('#monthSelection').classList.add('active');
        overLay.style.display = "block";
        setTimeout(function(){
            closeBtn.style.display = "block";
        }, 400);

        if(tempYear === "2021") {
            document.querySelectorAll('#monthSelection .list-items ul button').forEach(function(button){
                button.setAttribute('disabled', 'disabled');
            });
            document.querySelectorAll('#monthSelection .list-items ul button')[11].removeAttribute('disabled');
        }
        else {
            document.querySelectorAll('#monthSelection .list-items ul button').forEach(function(button){
                button.removeAttribute('disabled', 'disabled');
            });
        }
        });
})



document.querySelector('#shareCTA').addEventListener('click', function(){
document.querySelector('#loader').style.display = "block";
let node = document.querySelector('.screengrab');
let titleTag = document.querySelector('header .title');
titleTag.classList.add('update-font-size-for-capture');

let hideElement = document.querySelectorAll('.hide-on-capture');
hideElement.forEach(function(el){
    el.classList.add("activate");
})
document.querySelector('#loader').classList.add('active');

overLay.style.display = "block";

// domtoimage.toPng(node)
setTimeout(function(){
domtoimage.toPng(node)
.then(function (dataUrl) {

    // var img = new Image();
    // img.setAttribute("id", "screenGrab");
    // img.src = dataUrl;
    // document.body.appendChild(img);
    // console.log(dataUrl)
    hideElement.forEach(function(el){
        el.classList.remove("activate");
    })
    document.querySelector('body').classList.remove('options-opened');
    document.querySelector('#loader').classList.remove('active');
    overLay.style.display = "none";
    const blob = dataURItoBlob(dataUrl);
    const filesArray = [
        new File(
        [blob],
        'PrayerTimeUAE.jpg',
        {
            type: "image/jpeg",
            lastModified: new Date().getTime()
        }
        )
    ];
    const shareData = {
        files: filesArray,
        title: 'Prayer Time UAE',
        text: `Prayer Time UAE - ${prayerObj.city} \nDate: - ${todayObj.day}, ${todayObj.week_day} - ${monthNames[prayerObj.month -  1].slice(0, 3) + ' ' + prayerObj.year} \n\nFajr: ${todayObj.fajr} \nDhuhr: ${todayObj.dhuhr} \nAsr: ${todayObj.asr} \nMaghrib: ${todayObj.maghrib}\nIsha: ${todayObj.isha}\n`,
    };
    
    // if (navigator.canShare && navigator.canShare(shareData)) {
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        alert("Your browser dose not support Web Share API!");
        overLay.click();
    }
})
.catch(function (error) {
    console.error('oops, something went wrong!', error);
});
}, 200);

});




function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}



document.querySelector('.month').addEventListener('click', function(){
    document.querySelector('#yearSelection').classList.add('active');
    overLay.style.display = "block";
    setTimeout(function(){
        closeBtn.style.display = "block";
    }, 400)
});



document.querySelector('#monthSelection .back-button').addEventListener('click', function(){
    document.querySelector('#monthSelection').classList.remove('active');
    overLay.style.display = "none";
    setTimeout(function(){
        closeBtn.style.display = "block";
    }, 400);

     document.querySelector('#yearSelection').classList.add('active');
    overLay.style.display = "block";
    setTimeout(function(){
        closeBtn.style.display = "block";
    }, 400);

});


document.querySelectorAll('#monthSelection .list-items ul button').forEach(function(button){
    button.addEventListener('click', function(e){
        let getSelectedMonth = e.target.getAttribute('data-val');
        tempMonth = getSelectedMonth;
        console.log(tempMonth);

        document.querySelector('#selectedPrayerView').classList.add('active');
        overLay.style.display = "block";
        setTimeout(function(){
            closeBtn.style.display = "block";
        }, 400);
        document.querySelector('#selectedPrayerView .back-button .year-link-text').textContent = `${monthNames[tempMonth - 1]} - ${tempYear}`;


    fetch(`/${selectedLocation}/${tempYear}/${tempMonth}/prayertimings.json`)
    .then(function(response) {
        return response.json();
    })
    .then(function(json){      
        let totalDays = getDaysInMonth(json.month, json.year);          
        document.querySelector(`#selectedPrayerView .month-inner`).innerHTML = "";
        for(i=1;i<=totalDays;i++) {
                document.querySelector(`#selectedPrayerView .month-inner`).innerHTML += `<div class="values day${i}">
                <div>${i}</div><div>${json[`date${i}`].fajr}</div><div>${json[`date${i}`].dhuhr}</div><div>${json[`date${i}`].asr}</div><div>${json[`date${i}`].maghrib}</div><div>${json[`date${i}`].isha}</div>
                </div>`;
        }
        setTimeout(function(){
            document.querySelector(`#selectedPrayerView .month-inner .day1`).scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        }, 400);
    });

    });
});



document.querySelector('#selectedPrayerView .back-button').addEventListener('click', function(){
    document.querySelector('#selectedPrayerView').classList.remove('active');
    overLay.style.display = "none";
    setTimeout(function(){
        closeBtn.style.display = "block";
    }, 400);

     document.querySelector('#monthSelection').classList.add('active');
    overLay.style.display = "block";
    setTimeout(function(){
        closeBtn.style.display = "block";
    }, 400);

});




if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
}  



// const share = e => {
//     if (navigator.share) {
//         navigator
//         .share({
//             title: "Prayer Timings UAE",
//             text: `Date: - ${todayObj.day}, ${todayObj.week_day} - ${monthNames[prayerObj.month -  1].slice(0, 3) + ' ' + prayerObj.year} \n\nFajr: ${todayObj.fajr} \nDhuhr: ${todayObj.dhuhr} \nAsr: ${todayObj.asr} \nMaghrib: ${todayObj.maghrib}\nIsha: ${todayObj.isha}\n`,
//             url: "https://ptuae.netlify.app"
//         })
//         .then(() => {
//             console.log("thanks for sharing...");
//             overLay.click();
//         })
//         .catch(error => console.log("error", error));
//     }
    
//     if(!navigator.share) {
//         alert("Your browser dose not support Web Share API!");
//         overLay.click();
//     }   
//     };
    
    // document.querySelector('#shareCTA').addEventListener('click', share);