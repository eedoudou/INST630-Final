let forecastApi = "https://api.openweathermap.org/data/2.5/forecast";
let weatherApi = "https://api.openweathermap.org/data/2.5/weather";

let city;
let country;
let appid = "5be662184a5f66d241c04ec58eab34ec";

let day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let dayShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let gifSrc = "src/gif/";
let gifDict = {
    "2": "storm.gif",
    "3": "rainy.gif",
    "5": "rainy.gif",
    "6": "rainy.gif",
    "7": "sunny.gif",
    "8": "cloudy.gif",
}
let materialDict = {
    "2": "Thunderstorm",
    "3": "Rainy",
    "5": "Rainy",
    "6": "Rainy",
    "7": "Sunny",
    "8": "Cloudy",
}

let updateTime = function () {
    let date = new Date();

    let timeStr = day[date.getDay()] + ' ' + month[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getHours() % 12 + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes()  + " " + (date.getHours() >= 12 ? "PM" : "AM");
    document.getElementById('current-time').innerText = timeStr;
};

updateTime();
setInterval(updateTime, 1000);

function getWeather(lat, lon){
    let curWeatherApi = weatherApi + "?lat=" + lat + "&lon=" + lon + "&appid=" + appid + "&units=metric";
    $.getJSON(curWeatherApi, function (data) {
        // console.log(data);

        document.getElementById("current-temp").innerText = Math.round(data["main"]["temp"]);
        document.getElementById("current-humidity").innerText = data["main"]["humidity"] + "%";
        document.getElementById("current-feelslike").innerText = Math.round(data["main"]["feels_like"]) + "°C";

        let weather = data["weather"][0]["id"];
        let firstDigitStr = String(weather)[0];
        let hero = document.getElementsByClassName("hero")[0];
        let $weather = document.getElementById("current-weather");
        switch (firstDigitStr){
            case "8":
                if (weather == "800") {
                    hero.style.backgroundImage = "url(" + gifSrc + gifDict["7"] + ")";
                    $weather.innerText = materialDict["7"];
                } else {
                    hero.style.backgroundImage = "url(" + gifSrc + gifDict["8"] + ")";
                    $weather.innerText = materialDict["8"];
                }
                break;
            default:
                hero.style.backgroundImage = "url(" + gifSrc + gifDict[firstDigitStr] + ")";
                $weather.innerText = materialDict[firstDigitStr];
        }

    });
    let curForecastApi = forecastApi + "?lat=" + lat + "&lon=" + lon + "&appid=" + appid + "&units=metric";
    $.getJSON(curForecastApi, function (data) {
        // console.log(data);

        let cityName = data["city"]["name"];
        let country = data["city"]["country"];
        document.getElementById("address").innerText = cityName + ", " + country;

        let sunrise = new Date((data["city"]["sunrise"]) * 1000);
        let sunriseTime =  sunrise.getHours() % 12 + ":" + (sunrise.getMinutes()<10?'0':'') + sunrise.getMinutes() + " " + (sunrise.getHours() >= 12 ? "PM" : "AM");
        let sunset = new Date((data["city"]["sunset"]) * 1000);
        let sunsetTime =  sunset.getHours() % 12 + ":" + (sunset.getMinutes()<10?'0':'') + sunset.getMinutes() + " " + (sunset.getHours() >= 12 ? "PM" : "AM");

        document.getElementById("sunset-time-major").innerText = "Today's Sunset Time " + sunsetTime;
        document.getElementById("sunrise-time-minor").innerText = sunriseTime;
        document.getElementById("sunset-time-minor").innerText = sunsetTime;

        let weatherList = [];
        for (let i = 0; i < data["list"].length; i ++){
            let cur = {};
            cur.date = new Date(data["list"][i]["dt"] * 1000);
            cur.humidity = data["list"][i]["main"]["humidity"];
            cur.temp = data["list"][i]["main"]["temp"];
            cur.weather = data["list"][i]["weather"][0]["id"];
            cur.pop = data["list"][i]["pop"];
            if (data["list"][i]["rain"] !== undefined){
                cur.rain = data["list"][i]["rain"]["3h"];
            }else{
                cur.rain = 0;
            }

            weatherList.push(cur);
        }
        console.log(weatherList);
        document.getElementById("precipitation").innerText = weatherList[0].rain + " mm";
        document.getElementById("pop").innerText = weatherList[0].pop * 100 + "%";

        let table = document.getElementById("forecast-table");
        table.innerHTML = "";

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        let chartData = [];
        chartData.push(["Time", "Temperature"]);
        let minTemp = 80;
        let maxTemp = -40;

        for (let i = 0; i < 7; i ++){
            let time = weatherList[i].date.getHours() % 12 + " " + (weatherList[i].date.getHours() >= 12 ? "PM" : "AM");
            chartData.push([time, weatherList[i].temp]);
            minTemp = Math.min(minTemp, weatherList[i].temp);
            maxTemp = Math.max(maxTemp, weatherList[i].temp);
            let weather = weatherList[i].weather;
            let firstDigitStr = String(weather)[0];
            let weatherString = "Sunny";
            switch (firstDigitStr){
                case "8":
                    if (weather == "800") {
                       weatherString = materialDict["7"];
                    } else {
                        weatherString = materialDict["8"];
                    }
                    break;
                default:
                    weatherString = materialDict[firstDigitStr];
            }

            table.innerHTML += "<a>" +
                "<p>" +
                "<spancolor>" + weatherList[i].date.getHours() % 12 + " " + (weatherList[i].date.getHours() >= 12 ? "PM" : "AM") + "</spancolor>" +
                "</p>" +
                "<p>" + dayShort[weatherList[i].date.getDay()] +"</p>" +
                "<span class=\"material-symbols-rounded\">" +
                 weatherString + "</span>" +
                "<p>" +
                "<bold>" + Math.round(weatherList[i].temp)+ "°C</bold>" +
                "</p>" +
                "</a>";
            if (i !== 6){
                table.innerHTML += "<hr class=\"line\">";
            }
        }

        function drawChart(input) {
            console.log(chartData);
            var data = google.visualization.arrayToDataTable(chartData);


            var options = {
                chartArea: {
                    left: 20,
                    top: 30,
                    right: 0,
                    width: 'auto',
                    height: 'auto'
                },

                curveType: 'function',
                legend: {position: 'none'},
                backgroundColor: {fill: 'transparent'},
                colors: ['#646E89'],
                pointSize: 10,
                pointShape: {type: 'triangle', rotation: 90},
                hAxis: {
                    baselineColor: '#e0440e', textPosition: 'none', gridlines: {
                        color: '#transparent'
                    }
                },
                vAxis: {

                    viewWindowMode:'explicit',
                    viewWindow: {
                        max:maxTemp + 2,
                        min:minTemp - 2
                    },
                    gridlines: {
                        color: 'transparent'
                    }
                },
                gridlines: {
                    color: 'transparent'
                }


            };

            var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

            chart.draw(data, options);
        }

        $(window).resize(function(){
            drawChart();
        });


    });
}

let lat = 38.98;
let lon = -76.93;
if (navigator.geolocation) {
    var positionOption = { timeout: 200, enableHighAccuracy: true };
    var gpsFailed = function() {
        //use some 3rd party position solution(get position by your device ip)
        console.log(lon, lat);
        getWeather(lat, lon);
    };
    navigator.geolocation.getCurrentPosition(function (position){
        lon = position.coords.longitude;
        lat = position.coords.latitude;

        console.log(lon, lat);
        getWeather(lat, lon);

    }, gpsFailed, positionOption);
}



// Responsive Action
//
// menuBtn.addEventListener("click", () => {
//     sideMenu.style.display = "block";
// });
//
// closeBtn.addEventListener("click", () => {
//     sideMenu.style.display = "none";
// });




