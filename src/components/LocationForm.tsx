import React, { FormEvent, useState } from 'react'
import styles from './LocationForm.module.css'
import { useEffect } from 'react'
import DefaultData from '@/src/data/DefaultData'
import { WeatherData, LocationData } from '@/src/data/types'
import getWeatherData from '@/src/lib/actions'


const emptyLocationData = {
	zip: '',
	name: '',
	lat: '',
	lon: '',
	country: ''
}

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

	const [zip, setZip] = useState<string | undefined>(undefined)

	/**
	 * Global State - Weather Data
	 * 
	 * @property {setWeatherData} - use instead: {@link updateWeatherData()}
	*/

	/**
	 * Global State - Current Location Data 
	 * 
	 * @property {setCurrentLocation} - use instead: {@link updateCurrentLocation()}
	*/
	const [currentLocation, setCurrentLocation] = useState<LocationData>(emptyLocationData)

	const [weatherData, setWeatherData] = useState<WeatherData>(DefaultData)

	const [isFormVisible, setIsFormVisible] = useState<boolean>(false)

	let lastTimeLocationUpdate: number = new Date().getTime()

	/**
	 * GET WEATHER DATA BY USERS CURRENT LOCATION
	 */
	useEffect(() => {
		getCurrentLocation()
	}, [])

	useEffect(() => {
		console.log('isLocationFormVisible: ', isLocationFormVisible)

		setIsFormVisible(isLocationFormVisible)
	}, [isLocationFormVisible])

	useEffect(() => {
		console.log('isLocationFormVisible: ', isLocationFormVisible)

		emitLocationFormVisibiltyState(isFormVisible)
	}, [isFormVisible])

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
		const response = await getWeatherData(lat, lon, zip)
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
