import { NextRequest } from "next/server"

export async function getWeatherData(request: NextRequest): Promise<Response> {
	const lat = request.nextUrl.searchParams.get('lat')
	const lon = request.nextUrl.searchParams.get('lon')
	const zip = request.nextUrl.searchParams.get('zip')

	// DETERMINE REQUEST URL BASED ON FORM DATA
	let url
	if (lat !== '' && lon !== '') {
		url = getUrl_latLon(lat, lon)
	}
	else if (zip !== '') {
		url = getUrl_zipCode(zip, "US")
	}
	else {
		console.error('No location data provided.')
		return Promise.reject(new Response(`Failed to get weather data. Either lat & lon was not set, and zip was not set.\n\tLat: ${lat}\n\tLon: ${lon}\n\tZip: ${zip}`, { status: 500 }))
	}

	// MAKE REQUEST
	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}

		const json = await response.json()
		console.log('json: ', json)

		if (!json.name) {
			return new Response(JSON.stringify({
				name: json[0].name,
				country: json[0].country,
				lat: json[0].lat,
				lon: json[0].lon
			}), {
				headers: {
					'Content-Type': 'application/json'
				},
				status: 200
			})

		}
		else {
			return new Response(JSON.stringify(json), {
				headers: {
					'Content-Type': 'application/json'
				},
				status: 200
			})
		}
	} catch (error: any) {
		console.error(error.message)
		return Promise.reject(new Response(`Failed to get weather data. Error: ${error}`, { status: 500 }))
	}
}

/**
 * Get weather data with a zipcode
 * @param {string} zipCode - 5 didgit string
 * @param {string} countryCode - Two letter string. i.e United States = US
 * @returns {string} Request ready URL
 */
function getUrl_zipCode(zipCode: any, countryCode: string): string {
	return `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${process.env.WEATHER_API_KEY}`
}

function getUrl_latLon(lat: any, lon: any): string {
	return `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${1}&appid=${process.env.WEATHER_API_KEY}`
}