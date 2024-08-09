import React, { useState, useEffect } from 'react'
import useGeocoding from './useGeocoding'
export function useWeatherApi() {
	const [location, getLocation] = useGeocoding()
	const apiKey = process.env.VITE_WEATHER_API_KEY
	const [data, setData] = useState({})
	const [isLocationRecentlyCalled, setIsLocationRecentlyCalled] = useState(false)

	console.log(`useWeatherApi data: `, data)

	useEffect(() => {
		console.log('location: ', location)
		if ((location.lat === null || location.lon === null) || isLocationRecentlyCalled) {
			setIsLocationRecentlyCalled(false)
			return
		}
		getData(location.lat, location.lon)
	}, [location])

	async function getData(lat: any, lon: any) {
		const url = `http://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`)
			}

			const json = await response.json()
			console.log('json: ', json)

			if (!isLocationRecentlyCalled) {
				setIsLocationRecentlyCalled(true)
				getLocation(null, lat, lon)
			}

			setData(json)
		} catch (error: any) {
			console.error(error.message)
		}

	}

	/**
	 * Submits location data to get weather data
	 * @param {string} zipCode - zip code
	 * @param {number} lat - latitude
	 * @param {number} lon - longitude
	 */
	function setLocation(zipCode: any, lat: null, lon: null): void {
		console.log(`setLocation()\n\tzipCode: ${zipCode}\n\tlat/lon: ${lat} / ${lon}`)

		if (lat !== null && lon !== null) getData(lat, lon)
		else getLocation(zipCode, lat, lon)
	}

	return [data, location, setLocation]
}