import { useEffect, useState } from 'react'
import CountryCodes from '@/src/data/CountryCodes.json'

const locationDefault = {
	zip: null, name: null, lat: null, lon: null, country: null
}

export default function useGeocoding(props = { lat: '', long: '' }): [any, Function] {

	const geocodingUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='
	const apiKey = process.env.VITE_WEATHER_API_KEY

	const [location, setLocation] = useState(locationDefault)
	// const [city, setCity] = useState('Lady Lake')
	// const [stateCode, setStateCode] = useState('FL')
	// const [countryCode, setCountryCode] = useState('US')
	// const [countryName, setCountryName] = useState('United States')
	// const [codes, setCodes] = useState(CountryCodes)

	/**
	 * 
	 * @param {string} zipCode 
	 * @param {number} lat 
	 * @param {number} lon 
	 */
	async function getLocation(zipCode: any, lat: any, lon: any) {
		console.log(`\ngetLocation():\n\tzipCode: ${zipCode}\n\tlat/lon: ${lat}/${lon}`)

		let url

		if (lat && lon) url = getUrl_latLon(lat, lon)
		else url = getUrl_zipCode(zipCode, "US")

		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`)
			}

			const json = await response.json()
			console.log('json: ', json)

			if (!json.name) setLocation({
				...locationDefault,
				name: json[0].name,
				country: json[0].country,
				lat: json[0].lat,
				lon: json[0].lon
			})
			else setLocation(json)
		} catch (error: any) {
			console.error(error.message)
		}

		// TODO: future feature is to search using some combination of country/state/city
		// setCity(city)
		// setStateCode(state)
		// const cCode = getCountryCode(country)
		// setCountryCode(cCode === null ? 'US' : cCode)

	}

	/**
	 * Get weather data with a zipcode
	 * @param {string} zipCode - 5 didgit string
	 * @param {string} countryCode - Two letter string. i.e United States = US
	 * @returns {string} Request ready URL
	 */
	function getUrl_zipCode(zipCode: any, countryCode: string) {
		return `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`
	}

	function getUrl_latLon(lat: any, lon: any) {
		return `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${1}&appid=${apiKey}`
	}

	/**
	 * 
	 * @param {string} cName 
	 */
	// function getCountryCode(cName: string) {
	// 	console.log('getCountryCode()\n\tCountry Name: ', cName)

	// 	const space = ' '

	// 	let code = 'US'
	// 	let isCodeFound = false

	// 	// LOOK UP CODE FOR THE USER'S EXACT INPUT - maybe they spelled it as a proper noun i.e. "United States"
	// 	if (codes[cName]) {
	// 		code = codes[cName]
	// 		isCodeFound = true
	// 		console.log(`\tCode: ${code}`)
	// 	}

	// 	// MODIFY USER'S NAME TO A PROPER NOUN - uppercase 1st letter
	// 	let modifiedName = ''
	// 	if (!isCodeFound) {
	// 		console.log(`\tmodifying name...`)

	// 		const wordArr = cName.split(' ')

	// 		wordArr.forEach((word: string, index: number) => {
	// 			// 1st letter
	// 			modifiedName += word.slice(0, 1).toUpperCase()
	// 			// rest of the word
	// 			if (word.length > 1)
	// 				modifiedName += word.slice(1).toLowerCase()
	// 			// add space if there's another word
	// 			if (wordArr.length > index + 1)
	// 				modifiedName += ' '
	// 		})

	// 		console.log(`modified country name: ${modifiedName}`)
	// 	}

	// 	// SEARCH FOR CODE W/MODIFIED COUNTRY NAME
	// 	if (!isCodeFound && codes[modifiedName]) {
	// 		console.log(`found code with modified country name: ${modifiedName}`)
	// 		code = codes[modifiedName]
	// 		isCodeFound = true
	// 		console.log(`\tCode: ${code}`)
	// 	}

	// 	// SET CODE IF FOUND AND EXIT
	// 	if (isCodeFound) {
	// 		return codes[code]
	// 	}

	// 	// when all else fails - LOOP THE KEYS FOR POTENTIAL MATCHES
	// 	const matches: string[] = []
	// 	Object.keys(codes).forEach(key => {
	// 		if (key.includes(modifiedName)) matches.push(key)
	// 	})

	// 	if (matches.length === 1) return codes[code]
	// 	else {
	// 		console.log('Matches: ', matches)
	// 		return null
	// 	}
	// }


	return [location, getLocation]
}