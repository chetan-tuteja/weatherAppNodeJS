const express = require('express');
const request = require('request');
const app = express();
const bodyParser = require('body-parser');



const apiKey = "812d7c7e3a5d6fe618a0495036f8ced9";

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { weather: null, error: null });
});

app.post('/', (req, res) => {
    let city = req.body.city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    request(url, function (err, response, body) {
        if (err) {
            console.log("ERROR: " + err)
            res.render('index', { weather: null, error: 'ERROR! Please try again later.' });
        } else {
            let weather = JSON.parse(body);
            if (weather.main === undefined) {
                res.render('index', { weather: null, error: 'ERROR! Please try again later.' });
            } else {

                const date = new Date();
                const sunrise = new Date(weather.sys.sunrise * 1000); //Convert a Unix timestamp to time
                const sunset = new Date(weather.sys.sunset * 1000);
                let iconUrl = "";

                /* Get suitable icon for weather */
                if (date.getHours() >= sunrise.getHours() && date.getHours() < sunset.getHours()) {
                    iconUrl = `wi wi-owm-day-${weather.weather[0].id}`;
                }
                else {
                    iconUrl = `wi wi-owm-night-${weather.weather[0].id}`;
                }
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                weather.weather[0].description = weather.weather[0].description.toUpperCase();
                weather.sys.country = weather.sys.country.toLowerCase();

                res.render('index', {weather: weatherText, weatherData: weather, iconUrl, error: null });
            }
        }
    });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Listening on port, up and running!"));
