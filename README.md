# npm-openweathermap [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] 
>  Generate a weather forecast using http://www.openweathermap.com/ API.

## Installation

```sh
$ npm install --save npm-openweathermap
```

## Usage

```js
var weather = require('npm-openweathermap');

// api_key is required. You can get one at http://www.openweathermap.com/
weather.api_key = 'YOUR-API-KEY';

// OPTIONAL: you can set return temperature unit.
// 'k' for Kelvin
// 'c' for Celsius
// 'f' for Fahrenheit
weather.temp = 'c';
```

#### Basic usage

```js
weather.current_weather()
.then(function(result){
	console.log(result);
},function(error){
	console.log(error);
});

weather.forecast_weather()
.then(function(result){
	console.log(result);
},function(error){
	console.log(error);
})
```

#### Custom weather queries

This package allows custom queries to Openweathermap throw `get_weather_custom` function.

```js
// @function get_weather_custom(param_type, params, type)
// @params:
//		param_type: 
//			One of three values:
//				'city': query by city name
//				'zip': query by zipcode
//				'coordinates': query by coordinates
//		params:
//			City name or zipcode or coordinates object
//		type:
//			One of two values:
//				'weather': query for current weather
//				'forecast': query for forecast

weather.get_weather_custom('city', 'London', 'forecast').then(function(res){
	console.log(res);
},function(error){
	console.log(error)
})

weather.get_weather_custom('zip', '21804', 'weather').then(function(res){
	console.log(res);
},function(error){
	console.log(error)
})

var location = {
	longitude: '138.933334',
	latitude: '34.966671',
}
weather.get_weather_custom('coordinates', location, 'weather').then(function(res){
	console.log(res);
},function(error){
	console.log(error)
})
```

## License

MIT © [NghiaTran]()
<!-- [![Coverage percentage][coveralls-image]][coveralls-url] -->

[npm-image]: https://badge.fury.io/js/npm-openweathermap.svg
[npm-url]: https://npmjs.org/package/npm-openweathermap
[travis-image]: https://travis-ci.org/nghiattran/npm-openweathermap.svg?branch=master
[travis-url]: https://travis-ci.org/nghiattran/npm-openweathermap
[daviddm-image]: https://david-dm.org/nghiattran/npm-openweathermap.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/nghiattran/npm-openweathermap
[coveralls-image]: https://coveralls.io/repos/nghiattran/npm-openweathermap/badge.svg
[coveralls-url]: https://coveralls.io/r/nghiattran/npm-openweathermap
