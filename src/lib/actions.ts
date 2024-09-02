/**
 * @file Contains API Actions
 * @author Brendan Leighton 
 * {@link https://brens.app}
 */

'use server'

import { LocationData, WeatherData } from "@/src/data/types/"

const apiKey = process.env.WEATHER_API_KEY

/**
 * The returned data type of the default export {@link getWeatherData()}
 * 
 * @prop result.possibleLocations - When submitting location data (lat/lon or zip) to get the weather data, we sometimes can't get weather for that specific area but instead for a close-by location. This list will contain the nearby locations in this instance.
 * @prop data - The weather data returned from the weather api || null if call wasn't successful
 * @prop location - The location data associated with the weather data
 * @prop isSuccess - True if weather api call was successful, False otherwise
 * @prop errorMessage - Is the call fails, this message will contain more info
 */
type Result = {
	possibleLocations: LocationData[],
	data: WeatherData | null,
	location: LocationData,
	isSuccess: boolean,
	errorMessage: string
}

/**
 * Makes an API call to get weather data from {@link https://openweathermap.org/api/one-call-3}
 * 
 * Requrement for API call is one of the following: 
 * 1. lat & lon needs to be defined
 * 2. zip needs to be dfined
 * 
 * @default @exports @async
 * @param lat 
 * @param lon 
 * @param zip 
 * @returns The {@link Result}  of the API call
 */
export default async function getWeatherData(lat: string | undefined, lon: string | undefined, zip: string | undefined): Promise<{
	possibleLocations: LocationData[],
	data: WeatherData | null,
	location: LocationData,
	isSuccess: boolean,
	errorMessage: string
}> {

	// INITIALIZE RETURN VAL
	const result: Result = {
		possibleLocations: <LocationData[]>[],
		data: null,
		location: <LocationData>{ zip: zip, lat: lat, lon: lon, name: '' },
		isSuccess: <boolean>false,
		errorMessage: <string>''
	}

	// VALIDATE WE HAVE NECESSARY DATA
	if ((lat === undefined || lon === undefined) && zip === undefined) {
		result.errorMessage = `No location data provided - lat or lon is undefined or/and zip is undefined\n\tLat/Lon: ${lat} / ${lon}\n\tZip: ${zip}`
		return result
	}

	// GET POSSIBLE LOCATIONS - some zip-codes, or lat/lon combos, won't have weather data and we'll get a list of nearby locations
	result.location = await getLocationData(zip, lat, lon)
	if (result.possibleLocations.length > 1) {
		result.errorMessage = 'More than one possible location'
		return result
	}

	// GET WEATHER DATA
	if (result.location.lat !== undefined && result.location.lon !== undefined) {
		try {
			await getDataByLatLon(result.location.lat, result.location.lon).then(data => {
				// console.log('data: ', data.current)
				result.data = data
				result.isSuccess = true
			})
		} catch (error: any) {
			result.errorMessage = `ERROR: Couldn't getDataByLatLon\n\t${error.message}`
		}
	}

	// FINAL RETURN VALUE
	return result
}

/**
 * Constructs a URL to get LocationData with a zipcode and country code. Country code for United States is US
 * 
 * @private
 *  
 * @param zipCode - 5 didgit string
 * @param countryCode - Two letter string. i.e United States = US
 * @returns Request ready URL
 * @example API call with this URL returns an Object {
	return {
	 "zip": "90210",
	 "name": "Beverly Hills",
	 "lat": 34.0901,
	 "lon": -118.4065,
	 "country": "US"
	}
 }
 */
function getLocationDataRequestUrlByZip(zipCode: any, countryCode: string): string {
	return `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`
}

/**
 * Constructs a URL to get location data (not in LocationData format) with a latitude and longitude.
 * 
 * @private
 *  
 * @param lat - latitude coordinate
 * @param lon - longitude coordinate
 * @returns A request ready URL
 * @example API call with this URL returns an Array [
	{
		"name": "City of London",
		"lat": 51.5128,
		"lon": -0.0918,
		"country": "GB",
		"local_names": {
			"ar": "مدينة لندن",
			"ascii": "City of London",
			"bg": "Сити",
			"ca": "La City",
			"de": "London City",
			"el": "Σίτι του Λονδίνου",
			"en": "City of London",
			"fa": "سیتی لندن",
			"feature_name": "City of London",
			"fi": "Lontoon City",
			"fr": "Cité de Londres",
			"gl": "Cidade de Londres",
			"he": "הסיטי של לונדון",
			"hi": "सिटी ऑफ़ लंदन",
			"id": "Kota London",
			"it": "Londra",
			"ja": "シティ・オブ・ロンドン",
			"la": "Civitas Londinium",
			"lt": "Londono Sitis",
			"pt": "Cidade de Londres",
			"ru": "Сити",
			"sr": "Сити",
			"th": "นครลอนดอน",
			"tr": "Londra Şehri",
			"vi": "Thành phố Luân Đôn",
			"zu": "Idolobha weLondon"
		}
	},
	]
 */
function getLocationDataRequestUrlByLatLon(lat: any, lon: any): string {
	return `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${1}&appid=${apiKey}`
}

/**
 * Make an API call to get LocationData with either a zip-code or both a latitude and longitude
 * 
 * @private
 *  
 * @param {string} zipCode
 * @param {number} lat
 * @param {number} lon
 */
async function getLocationData(zipCode: any, lat: any, lon: any) {
	console.log(`\n-> getLocationData():\n\tzipCode: ${zipCode}\n\tlat/lon: ${lat}/${lon}`)

	// MAKE API CALL FOR LOCATION DATA

	// - configure request url
	let url
	if (lat && lon) url = getLocationDataRequestUrlByLatLon(lat, lon)
	else url = getLocationDataRequestUrlByZip(zipCode, "US")
	// - make API call
	try {
		// fetch
		const response = await fetch(url)
		// check
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}
		// parse json
		const json = await response.json()
		console.log('\n\tjson res from getLocationData: ', json)

		// return data
		if (!json.name) return { // if json is an array
			name: json[0].name,
			country: json[0].country,
			lat: json[0].lat,
			lon: json[0].lon,
			zip: zipCode
		}
		else return { // else json is an object
			name: json.name,
			country: json.country,
			lat: json.lat,
			lon: json.lon,
			zip: zipCode
		}

	} catch (error: any) {
		console.error('ERROR: Fetching location data: ', error.message)
		return {
			zip: zipCode,
			name: '',
			country: undefined,
			lat: lat,
			lon: lon
		}
	}
}

/**
 * Make an API call with just Latitude and Longitude
 * 
 * @private
 *  
 * @param lat
 * @param lon
 */
async function getDataByLatLon(lat: any, lon: any) {
	const url = `http://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
	try {
		// FETCH DATA
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}

		// GET JSON
		const json = await response.json()

		// RETURN
		return json

	} catch (error: any) {
		console.error('ERROR - getDataByLatLon(): ', error.message)
	}
}