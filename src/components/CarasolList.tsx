'use client'

import React, { useEffect, useRef } from 'react'
import styles from './CarasolList.module.css'
import { Temperature, Weather } from './index'
import { hourToString } from '@/src/lib/utils'
import { Hourly } from '@/src/data/types'

/**
 * @component
 * @param props - props
 * @param props.name - The name of the list
 * @param props.data - The data for the list and list-items
 * @returns 
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
export function CarasolList({ name, data }: { name: string, data: Hourly[] }) {

	if (!data) return

	// if (data.length) console.log('data.weather.icon', data[0].weather[0].icon)

	/**  */
	const list = useRef<HTMLUListElement>(null)

	useEffect(() => {
		// console.log('list', list)
		list.current?.childNodes.forEach((child: ChildNode) => {
			// console.log('child: ', child)
			if (child instanceof Element) {
				observer.observe(child)
			}
		})
	}, [list])

	const observer = new IntersectionObserver(entries => {
		// console.log('entries: ', entries)
		entries.forEach(element => {
			// console.log('element to observe: ', element)
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
						data && data.slice(0, 12).map((datum, index) => {
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
