import React, { FormEvent, useState } from 'react'
import styles from './LocationForm.module.css'
// import useRecentLocations from '../lib/useRecentLocations'
// import { LocationData } from '@/src/data/types/location'

export default function LocationForm(
	{
		// recentLocations,
		isLocationFormVisible,
		handleOnClick_toggleFormVisibility,
		emitZip
	}: {
		// recentLocations: LocationData[],
		isLocationFormVisible: boolean,
		handleOnClick_toggleFormVisibility: any,
		emitZip: any
	}) {

	const [zip, setZip] = useState<string | undefined>(undefined)

	function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		// TODO: validate zip

		emitZip(zip)
	}

	return (
		<div className={styles.LocationForm}
			style={{ display: isLocationFormVisible ? 'block' : 'none' }}
		>

			<div className={styles.backdrop}
				onClick={handleOnClick_toggleFormVisibility}
			></div>

			<form
				method='get'
				onSubmit={e => handleOnSubmit(e)}
				className={styles.location_form}
				style={{ display: isLocationFormVisible ? 'flex' : 'none' }}
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
					onClick={handleOnClick_toggleFormVisibility}
				>Cancel</button>
			</form>
		</div>
	)
}
