'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
// TESTING DATA
import ExampleResponse from '../data/ExampleResponse.json'
import DefaultData from '@/src/data/DefaultData'
import { WeatherData } from '../data/types'
import getWeatherData from '../lib/actions'
import { BlockList, CarasolList, CurrentWeather } from '@/src/components'
import LocationForm from '../components/LocationForm'
import { LocationData } from '@/src/data/types/location'
import useRecentLocations from '@/src/lib/useRecentLocations'

export default function Home() {

	const isTesting = false
	const emptyLocationData = {
		zip: '',
		name: '',
		lat: '',
		lon: '',
		country: ''
	}

	/**
	 * Global State - Current Location Data 
	 * 
	 * @property {setCurrentLocation} - use instead: {@link updateCurrentLocation()}
	*/
	const [currentLocation, setCurrentLocation] = useState<LocationData>(emptyLocationData)
	/**
	 * Global State - Weather Data
	 * 
	 * @property {setWeatherData} - use instead: {@link updateWeatherData()}
	*/
	const [weatherData, setWeatherData] = useState<WeatherData>(DefaultData)
	/**
	 * Toggles the visibility of the LocationForm component
	 */
	const [isLocationFormVisible, setIsLocationFormVisible] = useState<boolean>(false)
	/**
	 * Recent Locationts
	 * 
	 * TODO - Move to LocationForm component
	 */
	// const [locations, addLocation, removeLocation] = useRecentLocations('recent_locations', [])

	let lastTimeLocationUpdate: number = new Date().getTime()

	/**
	 * GET WEATHER DATA BY USERS CURRENT LOCATION
	 */
	useEffect(() => {
		getCurrentLocation()
	}, [])

	/**
	 * LOG CURRENT LOCATION ON CHANGE
	 */
	useEffect(() => {
		console.log('currentLocation: ', currentLocation)
	}, [currentLocation])

	function getCurrentLocation() {
		navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
			console.log(`Current GeoLocation: ${position.coords.latitude}, ${position.coords.longitude}`)
			updateWeatherData(position.coords.latitude.toString(), position.coords.longitude.toString(), undefined)
		}, () => {
			// error code here
			console.warn("WARN: Couldn't get geolocation")
			setIsLocationFormVisible(true)
		})
	}

	/**
	 * Used inplace of useState set function {@link setCurrentLocation()}.
	 * 	
	 * 1. Disallows this function from running more than once every 0.5 seconds
	 * 2. Add new location to recentLocations
	 * 3. Update currentLocation useState object
	 * 
	 * @param newLocationData - location data to replace {@link currentLocation}
	 * @returns 
	 */
	function updateCurrentLocation(newLocationData: LocationData) {

		// Don't run if recently ran
		const currTime: number = new Date().getTime()
		if (currTime - lastTimeLocationUpdate < 500) return
		lastTimeLocationUpdate = currTime

		// new location data
		const newData: LocationData = {
			zip: newLocationData.zip,
			name: newLocationData.name,
			lat: newLocationData.lat,
			lon: newLocationData.lon,
			country: newLocationData.country
		}

		console.log('-> updateCurrentLocation: ', newData)

		// Add to recent locations and update current location
		// addLocation(newData)
		setCurrentLocation(newData)
	}

	/**
	 * Makes an API call to get weather data then updates state: {@link weatherData} and {@link currentLocation}
	 * 
	 * * Used in place of {@link setWeatherData()}
	 * 
	 * Requires either lat & lon, or just zip, to be defined to make API call
	 * @param lat - used for getting weather data via api call if available
	 * @param lon - same as lat
	 * @param zip - same as lat
	 */
	async function updateWeatherData(lat: string | undefined, lon: string | undefined, zip: string | undefined) {
		const response = await getWeatherData(lat, lon, zip)
		if (response.isSuccess && response.data) {
			setWeatherData(response.data)
			updateCurrentLocation(response.location)
			setIsLocationFormVisible(false)
		}
	}

	/**
	 * Handle submitting the zip-code emitted from {@link LocationForm} to get weather data
	 * @param zip - The zip code submitted by the LocationForm. Has already been validated by LocationForm.
	 */
	function handleOnSubmit_locationForm(zip: string) {
		updateWeatherData(undefined, undefined, zip)
	}

	return (
		<main id='root' >

			<LocationForm
				isLocationFormVisible={isLocationFormVisible}
				handleOnClick_toggleFormVisibility={() => setIsLocationFormVisible(!isLocationFormVisible)}
				emitZip={handleOnSubmit_locationForm}
			/>

			<CurrentWeather
				data={weatherData}
				location={currentLocation.name}
				onClick_toggleLocationFormVisibility={() => setIsLocationFormVisible(!isLocationFormVisible)}
			/>

			{/* HOURLY */}
			< CarasolList
				name='12-HOUR FORECAST'
				data={weatherData.hourly && weatherData.hourly}
			/>

			{/* DAILY */}
			<BlockList
				title='10-DAY FORECAST'
				data={weatherData.daily}
			/>
		</main >
	)
}
