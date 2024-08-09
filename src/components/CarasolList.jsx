import React, { cloneElement, createElement, useEffect, useRef } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import styles from './CarasolList.module.css'
import { Temperature, Weather } from './index'
import { minuteToString, hourToString, dayToString, dateToString } from '@/src/lib/utils'

/**
 * @component
 * @param {object} props - props
 * @param {string} props.name - The name of the list
 * @param {object} props.data - The data for the list and list-items
 * @returns {React.ComponentElement}
 * @example 
 * // 'data' looks like this...
 * [
 * 	{
 * 		"dt": 1720580400,
 * 		"temp": 76.05,
 * 		"feels_like": 76.46,
 * 		"pressure": 1015,
 * 		"humidity": 66,
 * 		"dew_point": 63.88,
 * 		"uvi": 0,
 * 		"clouds": 68,
 * 		"visibility": 10000,
 * 		"wind_speed": 13.91,
 * 		"wind_deg": 174,
 * 		"wind_gust": 22.17,
 * 		"weather": [
 * 			{
 * 				"id": 803,
 * 				"main": "Clouds",
 * 				"description": "broken clouds",
 * 				"icon": "04n"
 * 			}
 * 		],
 * 		"pop": 0
 * 	},
 *  ...
 * ]
 */
export function CarasolList({ name, data }) {

	if (!data) return

	if (data.weather) console.log('data.weather.icon', data.weather.icon)

	/** @type {import('react').RefObject<HTMLUListElement>} */
	const list = useRef(null)

	useEffect(() => {
		list.current.childNodes.forEach(li => {
			observer.observe(li)
		})
	}, [list])

	const observer = new IntersectionObserver(entries => {
		entries.forEach(element => {

			console.log('element: ', element)

			if (element.isIntersecting) {
				element.target.classList.add(styles.show)
			} else {
				element.target.classList.remove(styles.show)
			}
		})
	}, {
		threshold: [0.25, 0.5] // [left threshold, right threshold]
	})

	return (
		<div className={styles.CarasolList}>

			{/* CARASOL HEADING */}
			<h2 className={`${styles.heading} forecast-heading`}>{name.toUpperCase()}</h2>

			{
				// LIST
				<ul className={styles.list} ref={list}>
					{
						data && data.map((datum, index) => {
							return (
								// - lIST ITEM
								<li className={styles.item} key={index}>

									{/* - - HEADING */}
									<h3 className={styles.heading}>
										{
											// HOURLY = time
											hourToString(datum.dt)
										}
									</h3>

									{/* - - WEATHER */}
									<Weather
										data={datum.weather}
										percipitation={datum.pop}
									/>

									{/* - - TEMERATURE */}
									<Temperature
										temp={datum.temp}
										feels_like={datum.feels_like}
									/>
								</li>
							)
						})
					}
				</ul>
			}
		</div>
	)
}
