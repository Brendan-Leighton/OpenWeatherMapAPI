'use server'

const locationDefault = {
	zip: null, name: null, lat: null, lon: null, country: null
}

export default function useGeocoding(props = { lat: '', long: '' }) {

	const apiKey = process.env.VITE_WEATHER_API_KEY
	let location = locationDefault

	const setLocation = (newLocation: any) => {
		location = newLocation
	}

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
				name: json[0].name,
				country: json[0].country,
				lat: json[0].lat,
				lon: json[0].lon
			})
			else setLocation(json)
		} catch (error: any) {
			console.error(error.message)
		}
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

	return [location, getLocation]
}