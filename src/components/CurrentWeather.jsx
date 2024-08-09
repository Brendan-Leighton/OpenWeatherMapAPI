import React, { useState, useEffect } from 'react'

import styles from './CurrentWeather.module.css'
import { minuteToString, monthToString } from '@/src/lib/utils'
import { Temperature, Weather } from './'

/**
 * 
 * @param {object} props - props passed in
 * @param {object} props.data - Current weather data 
 * @returns 
 */
export function CurrentWeather({ data, location, onClick_toggleLocationFormVisibility }) {

	if (!data.current) return <p>No Data</p>

	const [currentDate, setCurrentDate] = useState()
	const [isMoreDataVisisble, setIsMoreDataVisisble] = useState(false)

	useEffect(() => {
		if (!data.current) return
		if (data.current.dt) {
			console.log('data.currnet.dt: ', data.current.dt)
			setCurrentDate(new Date(data.current.dt * 1000))  // multiply becase we get seconds and need to pass milliseconds
		}

		console.log('feels_like: ', data.current.feels_like)
	}, [data])
	console.log('currentDate: ', currentDate)


	return (
		<section className={styles.CurrentWeather}>
			<header>
				<h2>{location !== null ? location : 'Location'}</h2>
				<button onClick={onClick_toggleLocationFormVisibility}>Edit</button>
				<p className={styles.subheading}>
					<Temperature temp={data.current.temp} /> | {data.current.weather[0].main}
				</p>
			</header>

			<main className={styles.main_content}>
				<div className={styles.expand_hidden_data}>
					<button onClick={() => setIsMoreDataVisisble(!isMoreDataVisisble)}>View More Current</button>
				</div>

				<div className={styles.hidden_data} style={{ display: isMoreDataVisisble ? 'flex' : 'none' }}>
					{data.current &&
						<>

							{/* TEMPERATURE */}
							<div className={styles.temperature}>
								<h3>Temp</h3>
								{
									(data.current.temp && data.current.feels_like) &&
									<Temperature
										temp={data.current.temp}
										feels_like={data.current.feels_like}
									/>
								}
							</div>

							{/* RAIN / SNOW */}
							<div className={styles.rain_snow}>
								<h3>Rain/Snow</h3>
								{
									data.current.rain ? `Rain ${data.current.rain} mm/h`
										: data.current.snow ? `Snow ${data.current.snow} mm/h`
											: ` N/A`
								}
							</div>

							{/* CLOUDINESS */}
							<div className={styles.cloudiness}>
								<h3>Coudiness</h3>
								{data.current.clouds}%
							</div>

							{/* VISIBILITY (api is in kilimeters) */}
							<div className={styles.visibility}>
								<h3>Visibility</h3>
								{data.current.visibility / 1000} km
							</div>

							{/* WIND */}
							<div className={styles.wind}>
								<h3>Wind</h3>
								<div>Speed / Gusts</div>
								{data.current.wind_speed} / {data.current.wind_gust} mph
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
					}
				</div>
			</main >
		</section>
	)
}
