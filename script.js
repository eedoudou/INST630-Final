let forecastApi = "https://api.openweathermap.org/data/2.5/forecast";
let weatherApi = "https://api.openweathermap.org/data/2.5/weather";

let city;
let country;
let appid = "5be662184a5f66d241c04ec58eab34ec";

let day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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

    let timeStr = day[date.getDay()] + ' ' + month[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
    document.getElementById('current-time').innerText = timeStr;
};

updateTime();
setInterval(updateTime, 1000);

function getWeather(lat, lon){
    let curWeatherApi = weatherApi + "?lat=" + lat + "&lon=" + lon + "&appid=" + appid + "&units=metric";
    $.getJSON(curWeatherApi, function (data) {
        console.log(data);

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
        console.log(data)

        let cityName = data["city"]["name"];
        let country = data["city"]["country"];
        document.getElementById("address").innerText = cityName + ", " + country;

        let sunrise = new Date((data["city"]["sunrise"]) * 1000);
        let sunriseTime =  sunrise.getHours() + ":" + (sunrise.getMinutes()<10?'0':'') + sunrise.getMinutes();
        let sunset = new Date((data["city"]["sunset"]) * 1000);
        let sunsetTime =  sunset.getHours() + ":" + (sunset.getMinutes()<10?'0':'') + sunset.getMinutes();

        document.getElementById("sunset-time-major").innerText = "Today's Sunset Time " + sunsetTime;
        document.getElementById("sunrise-time-minor").innerText = sunriseTime;
        document.getElementById("sunset-time-minor").innerText = sunsetTime;


        let weatherList = [];
        for (let i = 0; i < data["list"].length; i ++){
            let cur = {};
            cur.date = new Date(data["list"][i]["dt"] * 1000);
            cur.humidity = data["list"][i]

            weatherList.push(cur);
        }

    });
}

let lon = 38.98;
let lat = -76.93;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position){
        lon = position.coords.longitude;
        lat = position.coords.latitude;

        console.log(lon, lat);
        getWeather(lat, lon);
    });
}else{
    console.log("");
}

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Week', 'Temp', 'Prec', 'Wind'],
        ['Mon',  15,      20, 15],
        ['Tues',  20,      22, 6],
        ['Wed',  1,      25, 82],
        ['Thur',  7,      36, 11],
    ]);

    var options = {
        curveType: 'function',
        legend: {position: 'none'},
        backgroundColor: {fill: 'transparent'},
        hAxis: {
            baselineColor: 'none', textPosition: 'none', gridlines: {
                color: 'transparent'
            }
        },
        vAxis: {
            textPosition: 'none', gridlines: {
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