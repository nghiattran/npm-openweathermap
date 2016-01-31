'use strict';

var request = require('request');
var q = require('q');

var weather = exports;

weather.api_key = '';
weather.temp = '';
weather.return_type = '';

function create_error_promise(error)
{
    var deferred = q.defer();
    deferred.reject(new Error(error));
    return deferred.promise;
}

function location(){
	var deferred = q.defer();
	request('http://freegeoip.net/json/', function (error, response, body) {
		if (!error && response.statusCode === 200) {
			deferred.resolve(JSON.parse(body));
		} else {
			deferred.reject(error);
		}
	});
	return deferred.promise;
}

function set_geographic_coor_query(location){
	return {
		lon: location.longitude,
		lat: location.latitude,
		appid: weather.api_key
	};
}

function send_weather_request(query, type){
	// type [string]: 
	// 		'forecast' for future
	// 		'weather' for current

	var deferred = q.defer();
	var options = {
		url: 'http://api.openweathermap.org/data/2.5/' + type + '?',
		qs: query
	};

	request(options, function (error, response, body) {
		body = JSON.parse(body);
		if (!error && response.statusCode < 400) {
			deferred.resolve(body);
		} else if (response.statusCode > 400) {
			deferred.reject(body);
		} else if (error) {
			deferred.reject(error);
		}
	});
	return deferred.promise;
}

function error(error)
{
	return error;
}

function kelvin_to_celsius(kelvin){
	return (kelvin - 273.15).toFixed(2);
}

function kelvin_to_fahrenheit(kelvin){
	return (kelvin*9.0/5 - 459.67).toFixed(2);
}

function convert_temp(temp, type)
{
	if (type === 'c') {
		return kelvin_to_celsius(temp);
	} else if (type === 'k') {
		return temp;
	} else {
		return kelvin_to_fahrenheit(temp);
	}
}

function parse_weather_object(object){
	if (weather.return_type === 'simple') {
		return {
			main: object.weather[0].main,
			humidity: object.main.humidity,
			temp: convert_temp(object.main.temp, weather.temp),
			temp_min: convert_temp(object.main.temp_min, weather.temp),
			temp_max: convert_temp(object.main.temp_max, weather.temp),
			wind: object.wind.speed,
			dt: object.dt,
			dt_txt: object.dt_txt || null,
			rain: object.rain || {},
			snow: object.snow || {}
		};
	} else {
		return object;
	}
}

function parse_weather_objects(objects){
	var results = [];
	for (var i = 0; i < objects.list.length; i++) {
		results.push(parse_weather_object(objects.list[i]));
	}
	return results;
}

function set_custom_query(type, params)
{
	if (type === 'city') {
		return {q: params}
	} else if (type === 'coordinates') {
		return {
			lon: params.longitude,
			lat: params.latitude,
		}
	} else if (type === 'zip') {
		return {zip: params}
	} else {
		return -1; 
	}
}

weather.current_weather = function(){
	return location().then(function(location){
		var query = set_geographic_coor_query(location);
		return send_weather_request(query, 'weather').then(function(res){
			if (res.cod < 400) {
				return parse_weather_object(res);
			} else {
				return res;
			}
		});
	}, error(error));
};

weather.forecast_weather = function(){
	return location().then(function(location){
		var query = set_geographic_coor_query(location);
		return send_weather_request(query, 'forecast').then(function(res){
			if (res.cod < 400) {
				return parse_weather_objects(res);
			} else {
				return res;
			}
		});
	}, error(error));
};

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
weather.get_weather_custom = function(param_type, params, type){
	var query = set_custom_query(param_type, params);
	if (query === -1) {
		return create_error_promise('Invalid param type!');
	};
	query.appid = weather.api_key;
	return send_weather_request(query, type).then(function(res){
		if (res.cod < 400) {
			if (type === 'forecast') {
				return parse_weather_objects(res);
			} else {
				return parse_weather_object(res);
			}
		} else {
			return res;
		}
	}, error(error));
};