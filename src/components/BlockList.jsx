import React from 'react'
import styles from './BlockList.module.css'
import { Temperature, Weather } from './'
import { dayToString } from '@/src/lib/utils'


export function BlockList({ title, data }) {

	return (
		<section className={styles.BlockList}>
			<header>
				<h2 className='forecast-heading'>{title ? title : 'no title'}</h2>
			</header>

			<main className={styles.main}>
				{/* LIST */}
				<ul className={styles.list}>
					{
						data && data.map((datum, index) => {
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
