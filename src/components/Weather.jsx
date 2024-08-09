import React from 'react'
import styles from './Weather.module.css'

/**
 * 
 * @param {object} props - props
 * @param {object} data - Weather data object
 * @example
 * // example of 'data'  
 * 			{
 * 				"id": 803,
 * 				"main": "Clouds",
 * 				"description": "broken clouds",
 * 				"icon": "04n"
 * 			}
 * @returns {React.Component} - 
 */
export function Weather({ data, percipitation }) {
	if (!data) return <>no data</>

	return (
		<div className={styles.Weather}>

			{
				// DATA UNAVAILABLE
				!data || !data.length &&
				<p>Weather: n/a</p>
			}

			{data.length &&
				<>

					{
						// ICON
						data[0].icon &&
						<img src={`https://openweathermap.org/img/wn/${data[0].icon}.png`} alt="" title={data && data[0].description} />
					}

					{
						// PERCIPITATION %
						percipitation > 0 &&
						<div className={styles.percipitation}>{percipitation * 100}%</div>
					}
				</>
			}
		</div>
	)
}
