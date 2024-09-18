import React, { useState, useEffect, Suspense } from 'react'

import styles from './CurrentWeather.module.css'
import { minuteToString } from '@/src/lib/utils'
import { Temperature } from '.'
import { WeatherData } from '../data/types/'
import { BiSolidEditLocation } from "react-icons/bi"
import { IconContext } from 'react-icons'
import { MdOutlineExpandMore } from "react-icons/md"

/**
 * 
 * @returns 
 */
export function CurrentWeather(
	{ data, location, onClick_toggleLocationFormVisibility }
		:
		{ data: WeatherData | null, location: string | undefined, onClick_toggleLocationFormVisibility: any }
) {

	// const [currentDate, setCurrentDate] = useState<Date>()
	const [isMoreDataVisisble, setIsMoreDataVisisble] = useState(false)

	// useEffect(() => {
	// 	if (!data || !data.current) return
	// 	if (data.current.dt) {
	// 		setCurrentDate(new Date(data.current.dt * 1000))  // multiply becase we get seconds and need to pass milliseconds
	// 	}
	// }, [data])
	// console.log('currentDate: ', currentDate)

	useEffect(() => {
		console.log('CurrentWeather Component: location name: ', location)
	}, [location])


	return (

		<section className={styles.CurrentWeather}>
			<header>
				<h2>{location !== null && location !== '' ? `${location} ` : "Entered Location "}
					<button className={styles.editLocationButton} onClick={onClick_toggleLocationFormVisibility}>
						<BiSolidEditLocation />
					</button>
				</h2>

				<p className={styles.subheading}>
					<Temperature temp={data?.current.temp} /> | {data?.current.weather[0].main}
				</p>
			</header>

			<main className={styles.main_content}>
				<div className={styles.expand_hidden_data}>
					<button className={styles.view_more} onClick={() => setIsMoreDataVisisble(!isMoreDataVisisble)}>View More <MdOutlineExpandMore /></button>
				</div>

				<div className={styles.hidden_data} style={{ display: isMoreDataVisisble ? 'flex' : 'none' }}>
					{data?.current ?
						<>

							{/* TEMPERATURE */}
							<div className={styles.temperature}>
								<h3>Temp</h3>
								{
									data.current.temp &&
									<Temperature
										temp={data ? data.current.temp : 0}
									/>
								}
							</div>

							{/* RAIN / SNOW */}
							<div className={styles.rain_snow}>
								<h3>Rain/Snow</h3>
								{
									data.current.rain ?
										(
											data.current.rain.rain ? `Rain ${data.current.rain.rain} mm/h`
												: data.current.rain.snow ? `Snow ${data.current.rain.snow} mm/h`
													: ' N/A'
										)
										: ' N/A'
								}
							</div>

							{/* CLOUDINESS */}
							<div className={styles.cloudiness}>
								<h3>Coudiness</h3>
								{data ? data.current.clouds : '0'}%
							</div>

							{/* VISIBILITY (api is in kilimeters) */}
							<div className={styles.visibility}>
								<h3>Visibility</h3>
								{data ? data.current.visibility / 1000 : '0'} km
							</div>

							{/* WIND */}
							<div className={styles.wind}>
								<h3>Wind</h3>
								<div>Speed / Gusts</div>
								{data ? data.current.wind_speed : '0'} / {data ? data.current.wind_gust : '0'} mph
							</div>

							{/* ULTRA VIOLET INDEX */}
							<div className={styles.uv_index}>
								<h3>UV Index</h3>
								{
									data.current.uvi <= 2 ? `Low ${data.current.uvi}`
										: data.current.uvi <= 5 ? `Moderate ${data.current.uvi}`
											: data.current.uvi <= 7 ? `High ${data.current.uvi}`
												: data.current.uvi <= 10 ? `Very High ${data.current.uvi}`
													: `Extreme ${data.current.uvi}`
								}
							</div>

							{/* SUNRISE / SUNSET */}
							<div className={styles.sunrise_sunset}>
								{(data.current.sunrise && data.current.sunset) &&
									<>
										<h3>Sunrise & Sunset</h3>
										<p>
											{minuteToString(data.current.sunrise)}<br />
											{minuteToString(data.current.sunset)}
										</p>
									</>
								}
							</div>
						</>
						: <h2>N/A</h2>
					}
				</div>
			</main >
		</section>
	)
}
