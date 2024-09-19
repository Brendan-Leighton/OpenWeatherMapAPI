'use client'

import React, { useEffect, useRef } from 'react'
import styles from './CarasolList.module.css'
import { Temperature, Weather } from './index'
import { hourToString } from '@/src/lib/utils'
import { Hourly } from '@/src/data/types'

/**
 * Observer @access private
 * Watches an array of elements and show/hides them. Show when in view, hide when out of view.
 */
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

/**
 * @component A horizontally-scrolling list where the items fade-in/out when entering/leaving the viewport
 * @param props - props
 * @param props.name - The name of the list - used as this components heading-element
 * @param props.data - The data for the list and list-items
 * @returns component
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
export function CarasolList({ title, data }: { title: string, data: Hourly[] | undefined }) {

	/**  */
	const list = useRef<HTMLUListElement>(null)

	/**
	* When the list updates, 'observe' it's location on/off screen and show/hide the element.
	*/
	useEffect(() => {
		list.current?.childNodes.forEach((child: ChildNode) => {
			if (child instanceof Element) {
				observer && observer.observe(child)
			}
		})
	})

	// TODO: return something better
	// BASE CASE - return w/o data.
	if (!data) return

	return (
		<section className={styles.CarasolList}>
			<header>
				<h2 className='forecast-heading'>{title.toUpperCase()}</h2>
			</header>

			<main>
				<ul className={styles.list} ref={list}>
					{
						data ? data.slice(0, 12).map((datum, index) => {
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
							:
							<h3 className='m-auto'>N/A</h3>
					}
				</ul>
			</main>
		</section>
	)
}
