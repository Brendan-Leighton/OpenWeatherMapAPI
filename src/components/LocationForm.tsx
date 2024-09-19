import React, { FormEvent, useState } from 'react'
import styles from './LocationForm.module.css'
import { useEffect } from 'react'
import DefaultData from '@/src/data/DefaultData'
import { WeatherData, LocationData } from '@/src/data/types'
import GET from '@/src/lib/actions'

/**
 * Used to reset currentLocation
 */
const emptyLocationData = {
	zip: '',
	name: '',
	lat: '',
	lon: '',
	country: ''
}

/**
 * LocationForm Component
 * - Toggle-able form visibility (user toggled and auto toggled)
 * 	- Auto-ON when Navigator can't determine location,  
 * 	- Auto-OFF when user submits form and weather data call is successful
 * 	- Accepts boolean from parent to toggle form visibility
 * - Emits Location and Weather data for parent to use
 * 
 * @param param0 Props passed to the component
 * @returns - Form that collects a zip code and calls the OpenWeatherMap API to get weather data
 */
export default function LocationForm(
	{
		// recentLocations,
		isLocationFormVisible,
		emitData,
		emitLocationFormVisibiltyState
	}: {
		// recentLocations: LocationData[],
		isLocationFormVisible: boolean,
		emitData: any,
		emitLocationFormVisibiltyState: any
	}) {

	/** Zip code the user enters and is used to make weather api call */
	const [zip, setZip] = useState<string | undefined>(undefined)

	/**
	 * Global State - Current Location Data
	 * @property {setCurrentLocation} - use instead: {@link updateCurrentLocation()}
	*/
	const [currentLocation, setCurrentLocation] = useState<LocationData>(emptyLocationData)


	/**
	 * Global State - Weather Data
	 * @property {setWeatherData} - use instead: {@link updateWeatherData()}
	*/
	const [weatherData, setWeatherData] = useState<WeatherData>(DefaultData)

	/** Toggle form visibility */
	const [isFormVisible, setIsFormVisible] = useState<boolean>(false)

	/** Track the last api call to limit call frequency (API data updates every 10 minutes) */
	let lastTimeLocationUpdate: number = new Date().getTime()

	/**
	 * GET WEATHER DATA BY USERS CURRENT LOCATION
	 */
	useEffect(() => {
		getCurrentLocation()
	}, [])

	/**
	 * Update local state with boolean value passed in via component's props
	 */
	useEffect(() => {
		console.log('Setting LocationForm visibility\t\n> isLocationFormVisible: ', isLocationFormVisible)
		setIsFormVisible(isLocationFormVisible)
	}, [isLocationFormVisible])

	/**
	 * When local state value changes we emit it to parent who is also watching/updating the state value
	 */
	useEffect(() => {
		console.log('isLocationFormVisible: ', isLocationFormVisible)
		emitLocationFormVisibiltyState(isFormVisible)
	}, [isFormVisible])

	/**
	 * Using Navigator API to get user's current location and using the lat/lon to get/set state currentLocation
	 */
	function getCurrentLocation() {
		navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
			console.log(`Current GeoLocation: ${position.coords.latitude}, ${position.coords.longitude}`)
			updateWeatherData(position.coords.latitude.toString(), position.coords.longitude.toString(), undefined)
		}, () => {
			// error code here
			console.warn("WARN: Couldn't get geolocation")
			setIsFormVisible(true)
		})
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
		const response = await GET(lat, lon, zip)
		if (response.isSuccess && response.data) {
			setWeatherData(response.data)
			updateCurrentLocation(response.location)
			emitData(response.location, response.data)
			setIsFormVisible(false)
		}
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
	 * Handle form submission
	 * @param e FormEvent Object
	 */
	async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		// TODO: validate zip

		await updateWeatherData(undefined, undefined, zip)
	}

	return (
		<div className={styles.LocationForm}
			style={{ display: isFormVisible ? 'block' : 'none' }}
		>

			<div className={styles.backdrop}
				onClick={() => setIsFormVisible(false)}
			></div>

			<form
				method='get'
				onSubmit={e => handleOnSubmit(e)}
				className={styles.location_form}
				style={{ display: isFormVisible ? 'flex' : 'none' }}
			>

				{/* ZIP CODE */}
				<label
					htmlFor="zip-code"
				>
					<h2>Enter a Zip Code:</h2>
				</label>
				<input
					id='zip-code'
					type="text"
					pattern='^[0-9]{5}(?:-[0-9]{4})?$'
					placeholder={zip}
					onChange={e => setZip(e.target.value)}
				/>

				{
					// TODO - Add recent searches
					// recentLocations &&
					// <fieldset>
					// 	<legend>Or Choose A Previous Location</legend>
					// 	<ul>
					// 		{
					// 			recentLocations.map((location: LocationData, index: number) => {
					// 				const id_htmlFor = `${location.name}_${index}`
					// 				return (
					// 					<li key={index}>
					// 						<input
					// 							type="radio"
					// 							name='location'
					// 							id={id_htmlFor}
					// 							defaultChecked={index === 0}
					// 						/>
					// 						<label
					// 							htmlFor={id_htmlFor}>
					// 							{location.name} {location.zip}
					// 						</label>
					// 					</li>
					// 				)
					// 			})
					// 		}
					// 	</ul>
					// </fieldset>
				}

				<button type='submit'>Submit</button>
				<button
					onClick={() => setIsFormVisible(false)}
				>Cancel</button>
			</form>
		</div>
	)
}
