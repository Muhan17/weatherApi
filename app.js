const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/api.html');
});

app.post('/', function (req, res) {
  const query = req.body.cityName;

  const weatherApiKey = '08782a885421056897649b95456cf296';
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${weatherApiKey}&units=metric&lang=en`;

  https.get(weatherUrl, function (response) {
    let weatherData = '';

    response.on('data', function (data) {
      weatherData += data;
    });

    response.on('end', function () {
        weatherData = JSON.parse(weatherData);
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const speed = weatherData.wind.speed;
        const pressure = weatherData.main.pressure;
        const humidity = weatherData.main.humidity;
        const lat = weatherData.coord.lat;
        const lon = weatherData.coord.lon;

        res.write('<p>The temperature is ' + temp + ' degree Celsius</p>');
        res.write('<p>The weather is ' + description + '</p>');
        res.write('<img src="' + imageURL + '">');
        res.write('<p>The wind speed in ' + query + ' is: ' + speed + ' m/s</p>');
        res.write('<p>Current city pressure is: ' + pressure + ' hPa</p>');
        res.write('<p>Humidity of ' + query + ' city is: ' + humidity + '%</p<br>');
        res.write('<p>Coordinates: Latitude ' + lat + ', Longitude ' + lon + '</p>');
        
        const wUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;
        https.get(wUrl, function (resRain) {
        let rainData = '';

        resRain.on('data', function (data) {
        rainData += data;
        });

        resRain.on('end', function () {
        rainData = JSON.parse(rainData);
        const rainVolume = rainData.list[0].rain ? rainData.list[0].rain['3h'] || 0 : 0; 
        res.write(`<p>Rain volume in the last 3 hours: ${rainVolume} mm</p>`);

        // 1st API
      const jokeUrl = 'https://api.chucknorris.io/jokes/random';
      https.get(jokeUrl, function (resJoke) {
        let jokeData = '';

        resJoke.on('data', function (data) {
          jokeData += data;
        });

        resJoke.on('end', function () {
            jokeData = JSON.parse(jokeData);
            const joke = jokeData.value;
            res.write('<p>Chuck Norris Joke: ' + joke + '</p>');
         
          
          // 2nd API
          const boredUrl = 'https://www.boredapi.com/api/activity';
          https.get(boredUrl, function (resBored) {
            let boredData = '';

            resBored.on('data', function (data) {
              boredData += data;
            });

            resBored.on('end', function () {
              boredData = JSON.parse(boredData);
              const boredIdea = boredData.activity;
              res.write('<p>Bored Idea: ' + boredIdea + '</p');
              
              res.end();
                });
              });
            });
          });
        });
      });
    });
  });
});

app.listen(3000, function () {
  console.log('Server is running');
});
