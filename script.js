// var api = "https://api.openweathermap.org/data/2.5/weather", units = "metric", ipApi = "https://ipinfo.io/json",
//     iconClass = 'wi wi-owm-day-', // weather icons
//     city, country, bg, date;
//
// var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
//     month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//
// function uTime() {
//     date = new Date();
//     var timeStr = day[date.getDay()] + ', ' + month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getHours() + ':' + date.getMinutes();
//     $('#time').text(timeStr);
// }
//
// uTime();
// setInterval(uTime, 1000);
//
// function setWeather(w) {
//     var weather = w.weather[0];
//     if (date.getHours() >= 18 || date.getHours() <= 6) {
//         iconClass = 'wi wi-owm-night-';
//     }
//     var temp = Math.round(w.main.temp), pressure = w.main.pressure, humid = w.main.humidity, wind = w.wind.speed;
//
//     $('#place').text(city + ', ' + country);
//     $('#temp span').text(temp);
//     $('#icon').removeClass().addClass(iconClass + weather.id);
//
//     $('#p span').text(pressure);
//     $('#h span').text(humid);
//     $('#w span').text(wind);
//     $('.description').text(weather.description);
//     /*    background stuff;
//         if (this.temp < 34 && this.temp > 18 && this.time.getHours() < 16) {
//           bg = 'http://livehdwallpaper.com/wp-content/uploads/2014/10/Good-Morning-Photos.jpg';
//         }
//
//         if (bg) {
//           $('body').css('background', "url('" + bg + "')");
//         }
//     */
// }
//
// function getWeather() {
//     $.getJSON(api, function (data) {
//         setWeather(data);
//         stopAnimation();
//     });
// }
//
// function getLocation() {
//     return $.getJSON(ipApi, function (data) {
//         city = data.city;
//         country = data.country;
//         api += `?q=${city},${country}&APPID=5be662184a5f66d241c04ec58eab34ec&units=${units}`;
//         api = encodeURI(api);
//     });
// }
//
// getLocation()
//     .done(getWeather);
//
// var u = 'c';
//
// function convert(t) {
//     if (u == 'c') {
//         u = 'f';
//         return Math.round(t * 9 / 5 + 32);
//     } else {
//         u = 'c';
//         return Math.round((t - 32) * 5 / 9);
//     }
// }
//
// $('#temp').click(function () {
//     $('#temp span')
//         .fadeOut(null, () => {
//             $('#temp span').text(convert($(this).text()))
//                 .fadeIn();
//         });
// });
//
// function stopAnimation() {
//     $('#loading').fadeOut();
//     $('header').fadeIn();
// }