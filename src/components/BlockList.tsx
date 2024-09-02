import React from 'react'
import styles from './BlockList.module.css'
import { Temperature, Weather } from '.'
import { dayToString } from '@/src/lib/utils'
import { Daily, Weather as iWeather } from '../data/types'


export function BlockList({ title, data }: { title: string, data: Daily[] }) {

	return (
		<section className={styles.BlockList}>
			<header>
				<h2 className='forecast-heading'>{title ? title : 'no title'}</h2>
			</header>

			<main>
				{/* LIST */}
				<ul className={styles.list}>
					{
						data && data.map((datum: { dt: number; weather: iWeather[]; pop: number; temp: { min: number; max: number } }, index: React.Key | null | undefined) => {
							return (

								// - lIST ITEM
								<li className={styles.item} key={index}>

									{/* - - HEADING */}
									<h3 className={styles.heading}>
										{index === 0 ? 'Today' : dayToString(datum.dt)}
									</h3>

									{/* - - WEATHER */}
									<Weather
										data={datum.weather}
										percipitation={datum.pop}
									/>

									<div className={styles.temp}>
										<Temperature
											temp={datum.temp.min}
										/>
										{' - '}
										<Temperature
											temp={datum.temp.max}
										/>
									</div>
								</li>
							)
						})
					}
				</ul></main>
		</section>
	)
}
