import { Current, Daily, FeelsLike, Hourly, Minutely, Rain, Temp, Weather, WeatherData } from "./types"


const defaultRain: Rain = {
	rain: 0,
	snow: 0
}

const defaultWeather: Weather = {
	id: 0,
	main: 'n/a',
	description: 'n/a',
	icon: 'n/a'
}

const defaultCurrent: Current = {
	dt: 0,
	sunrise: 0,
	sunset: 0,
	temp: 0,
	feels_like: 0,
	pressure: 0,
	humidity: 0,
	dew_point: 0,
	uvi: 0,
	clouds: 0,
	visibility: 0,
	wind_speed: 0,
	wind_deg: 0,
	wind_gust: 0,
	rain: defaultRain,
	weather: [defaultWeather]
}

const defaultTemp: Temp = {
	day: 0,
	min: 0,
	max: 0,
	night: 0,
	eve: 0,
	morn: 0,
}

const defaultFeelsLike: FeelsLike = {
	day: 0,
	night: 0,
	eve: 0,
	morn: 0,
}

const defaultMinutely: Minutely = {
	dt: 0,
	precipitation: 0,
}

const defaultHourly: Hourly = {
	dt: 0,
	temp: 0,
	feels_like: 0,
	pressure: 0,
	humidity: 0,
	dew_point: 0,
	uvi: 0,
	clouds: 0,
	visibility: 0,
	wind_speed: 0,
	wind_deg: 0,
	wind_gust: 0,
	weather: [defaultWeather],
	pop: 1,
}

const testingHourly: Hourly = {
	dt: 0,
	temp: 0,
	feels_like: 0,
	pressure: 0,
	humidity: 0,
	dew_point: 0,
	uvi: 0,
	clouds: 0,
	visibility: 0,
	wind_speed: 0,
	wind_deg: 0,
	wind_gust: 0,
	weather: [defaultWeather],
	pop: 0,
}

const defaultDaily: Daily = {
	dt: 0,
	sunrise: 0,
	sunset: 0,
	moonrise: 0,
	moonset: 0,
	moon_phase: 0,
	summary: 'n/a',
	temp: defaultTemp,
	feels_like: defaultFeelsLike,
	pressure: 0,
	humidity: 0,
	dew_point: 0,
	wind_speed: 0,
	wind_deg: 0,
	wind_gust: 0,
	weather: [defaultWeather],
	clouds: 0,
	pop: 0,
	rain: 0,
	uvi: 0,
}

const defaultWeatherData: WeatherData = {
	lat: 0,
	lon: 0,
	timezone: 'n/a',
	timezone_offset: 0,
	current: defaultCurrent,
	minutely: [defaultMinutely],
	hourly: [defaultHourly, testingHourly, defaultHourly, defaultHourly, defaultHourly, defaultHourly, defaultHourly, defaultHourly, defaultHourly, defaultHourly, defaultHourly, defaultHourly,],
	daily: [defaultDaily, defaultDaily, defaultDaily, defaultDaily, defaultDaily, defaultDaily, defaultDaily, defaultDaily, defaultDaily, defaultDaily]
}

export default defaultWeatherData