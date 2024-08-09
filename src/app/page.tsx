'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { useWeatherApi } from '@/src/lib/hooks/useWeatherApi'
import { CarasolList, CurrentWeather, BlockList } from '@/src/components'

// TESTING DATA
import ExampleResponse from '../data/ExampleResponse.json'

let recentLocationObject = {
	zip: '32159',
	lat: '',
	lon: '',
	name: 'Lake County'
}

const recentSearches = [recentLocationObject, recentLocationObject, recentLocationObject]

export default function Home() {


	// TODO: add an underscore to the 'data' from useWeatherApi when using test data. remove underscore and comment test data when done testing.
	const [_data, location, setLocation] = useWeatherApi()
	const data = ExampleResponse
	const [country, setCountry] = useState('United States')
	const [state, setState] = useState('Florida')
	const [city, setCity] = useState('Lady Lake')
	const [zipCode, setZipCode] = useState('32159')
	const [isLocationFormVisible, setIsLocationFormVisisble] = useState(false)

	const [previousLocations, setPreviousLocations] = useState(new Array(recentSearches.length).fill(false))

	useEffect(() => {
		if (!navigator.geolocation) return
		navigator.geolocation.getCurrentPosition((position) => {
			setLocation(null, position.coords.latitude, position.coords.longitude)
		}, () => {
			// error code here
			console.warn("Error: Couldn't get geolocation")
			setIsLocationFormVisisble(true)
		})

		console.log('previousLocations: ', previousLocations)

	}, [])

	useEffect(() => {
		console.log('Location: ', location)
	}, [location])

	// TODO: Add Country, State, and City to this location form
	// function handleOnChange_country(e) {
	// 	console.log(e.target.value);
	// 	setCountry(e.target.value)
	// }
	// function handleOnChange_state(e) {
	// 	console.log(e.target.value);
	// 	setState(e.target.value)
	// }
	// function handleOnChange_city(e) {
	// 	console.log(e.target.value);
	// 	setCity(e.target.value)
	// }


	function handleOnChange_zipCode(e: ChangeEvent<HTMLInputElement>) {
		console.log(e.target.value)
		setZipCode(e.target.value)
	}

	/**
	 * 
	 * @param {Event} e - Event object when form is submitted
	 */
	function handleOnClick_submitLocationData(e: { preventDefault: () => void; target: HTMLFormElement | undefined }) {
		e.preventDefault()
		console.log(`handleOnClick_submitLocationData\n\tCountry: ${country}\n\tState: ${state}\n\t City: ${city}\n\tZip: ${zipCode}`)
		// TODO: uncomment below to get api data (also check the useWeatherApi hook called with the useState stuff)

		const formData = new FormData(e.target)
		const formJson = Object.fromEntries(formData.entries())
		if (formJson.lat !== '' && formJson.lon !== '') setLocation(null, formJson.lat, formJson.lon)
		else setLocation(formJson.zip, null, null)
	}

	console.log('recentSearches: ', recentSearches)
	console.log('previousLocations: ', previousLocations)

	return (
		<main id='root'>
			{/* LOCATION FORM */}
			<form
				method='get'
				onSubmit={handleOnClick_submitLocationData}
				className='location-form'
				style={{ display: isLocationFormVisible ? 'flex' : 'none' }}
			>

				{/* TODO: Add Country, State, and City to this location form */}
				{/* COUNTRY */}
				{/* <label htmlFor="country">Country:</label>
				<input id='country' type="text" placeholder={country} onChange={e => handleOnChange_country(e)} /> */}

				{/* STATE */}
				{/* <label htmlFor="state">State:</label>
				<input id='state' type="text" placeholder={state} onChange={e => handleOnChange_state(e)} /> */}

				{/* CITY */}
				{/* <label htmlFor="city">City:</label>
				<input id='city' type="text" placeholder={city} onChange={e => handleOnChange_city(e)} /> */}

				{/* ZIP CODE */}
				<label
					htmlFor="zip-code"
				>Zip Code:</label>
				<input
					id='zip-code'
					type="text"
					pattern='^[0-9]{5}(?:-[0-9]{4})?$'
					placeholder={zipCode}
					onChange={e => handleOnChange_zipCode(e)}
				/>

				{
					recentSearches.length > 0 &&
					<ul>
						{
							recentSearches.map((location, index) => {
								return (
									<li>
										<input
											type="radio"
											id={`${location.name}_${index}`}
											checked={previousLocations[index]}
											onChange={() => setPreviousLocations(prev =>
												prev.map((value, i) =>
													i === index
												)
											)}
										/>
										<label
											htmlFor={`${location.name}_${index}`}>
											{location.name} {location.zip}
										</label>
									</li>
								)
							})
						}
					</ul>
				}

				<button type='submit'>Submit</button>
			</form>

			<CurrentWeather
				data={data}
				location={location.name}
				country={location.country}
				zip={location.zip}
				onClick_toggleLocationFormVisibility={() => setIsLocationFormVisisble(!isLocationFormVisible)}
			/>

			{/* HOURLY */}
			< CarasolList
				name='12-HOUR FORECAST'
				data={data.hourly && data.hourly}
			/>

			{/* DAILY */}
			<BlockList
				title='10-DAY FORECAST'
				data={data.daily}
			/>
		</main>
	)
}
