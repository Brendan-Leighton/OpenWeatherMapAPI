'use client'

import { useEffect, useState } from 'react'
// TESTING DATA - use inplace of API data when you don't need it
import ExampleResponse from '../data/ExampleResponse.json'
// import DefaultData from '@/src/data/DefaultData'
import { WeatherData } from '../data/types'
import { BlockList, CarasolList, CurrentWeather } from '@/src/components'
import LocationForm from '../components/LocationForm'
import { LocationData } from '@/src/data/types/location'

// TODO - Add Recently Searched Locations
import useRecentLocations from '@/src/lib/useRecentLocations'

export default function Home() {

	/**
	 * Global State - Current Location Data
	*/
	const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
	/**
	 * Global State - Weather Data
	*/
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
	/**
	 * Toggles the visibility of the LocationForm component
	 */
	const [isLocationFormVisible, setIsLocationFormVisible] = useState<boolean>(false)

	/**
	 * LOG CURRENT LOCATION ON CHANGE
	 */
	useEffect(() => {
		console.log('currentLocation: ', currentLocation)
	}, [currentLocation])

	/**
	 * Accepts data emitted from the LocationForm component. Data is set to local state and then passed to other components
	 * @param location - data pertaining to the user's location
	 * @param weather WeatherData
	 */
	function handle_locationFormData(location: LocationData, weather: WeatherData) {
		setCurrentLocation(location)
		setWeatherData(weather)
	}

	return (
		<main id='root' >

			<LocationForm
				isLocationFormVisible={isLocationFormVisible}
				emitData={handle_locationFormData}
				emitLocationFormVisibiltyState={(state: boolean) => setIsLocationFormVisible(state)}
			/>

			<CurrentWeather
				data={weatherData}
				location={currentLocation?.name}
				onClick_toggleLocationFormVisibility={() => setIsLocationFormVisible(true)}
			/>

			{/* HOURLY */}
			< CarasolList
				title='12-HOUR FORECAST'
				data={weatherData?.hourly}
			/>

			{/* DAILY */}
			<BlockList
				title='10-DAY FORECAST'
				data={weatherData?.daily}
			/>
		</main >
	)
}
