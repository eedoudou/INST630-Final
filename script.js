let api = "https://api.openweathermap.org/data/2.5/forecast"
let units = "metric"
let iconClass = 'wi wi-owm-day-'; // weather icons
let city;
let country;
let bg;
let date;
let appid = "5be662184a5f66d241c04ec58eab34ec";

let day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let updateTime = function () {
    let date = new Date();

    let timeStr = day[date.getDay()] + ' ' + month[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
    document.getElementById('current-time').innerText = timeStr;
};

updateTime();
setInterval(updateTime, 1000);

function setWeather(w) {
    const weather = w.weather[0];
    if (date.getHours() >= 18 || date.getHours() <= 6) {
        iconClass = 'wi wi-owm-night-';
    }
    var temp = Math.round(w.main.temp), pressure = w.main.pressure, humid = w.main.humidity, wind = w.wind.speed;

    $('#place').text(city + ', ' + country);
    $('#temp span').text(temp);
    $('#icon').removeClass().addClass(iconClass + weather.id);

    $('#p span').text(pressure);
    $('#h span').text(humid);
    $('#w span').text(wind);
    $('.description').text(weather.description);
}

function getWeather(lat, lon){
    let newApi = api + "?lat=" + lat + "&lon=" + lon + "&appid=" + appid + "&units=metric";
    $.getJSON(newApi, function (obj) {
        console.log(obj)

        let cityName = obj["city"]["name"];
        let country = obj["city"]["country"];
        document.getElementById("address").innerText = cityName + ", " + country;

        let sunrise = new Date((obj["city"]["sunrise"]) * 1000);
        let sunriseTime =  sunrise.getHours() + ":" + (sunrise.getMinutes()<10?'0':'') + sunrise.getMinutes();
        let sunset = new Date((obj["city"]["sunset"]) * 1000);
        let sunsetTime =  sunset.getHours() + ":" + (sunset.getMinutes()<10?'0':'') + sunset.getMinutes();

        document.getElementById("sunset-time-major").innerText = "Today's Sunset Time " + sunsetTime;
        document.getElementById("sunrise-time-minor").innerText = sunriseTime;
        document.getElementById("sunset-time-minor").innerText = sunsetTime;

        document.getElementById("current-temp").innerText = Math.round(obj["list"][0]["main"]["temp"]);
        document.getElementById("current-humidity").innerText = obj["list"][0]["main"]["humidity"] + "%";
        document.getElementById("current-feelslike").innerText = Math.round(obj["list"][0]["main"]["feels_like"]) + "°C";
        let weatherList = [];
        for (let i = 0; i < obj["list"].length; i ++){
            let cur = {};
            cur.date = new Date(obj["list"][i]["dt"] * 1000);
            cur.humidity = obj["list"][i]

            weatherList.push(cur);
        }


        setWeather(obj);
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
        backgroundColor: { fill:'transparent' },
        hAxis: { baselineColor: 'none', textPosition: 'none', gridlines: {
                color: 'transparent'
            } },
        vAxis: { textPosition: 'none', gridlines: {
                color: 'transparent'
            } },
        gridlines: {
            color: 'transparent'
        }


    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}