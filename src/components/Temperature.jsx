import React from 'react'
import styles from './Temperature.module.css'
export function Temperature({ temp, feels_like }) {

	const fahrenheit = <span className='fahrenheit-symbol'>&#8457;</span>;
	return (
		<span className={styles.Temperature}>{Math.round(temp)}{fahrenheit}</span>
	)
}
