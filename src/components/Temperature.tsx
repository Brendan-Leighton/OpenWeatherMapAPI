import React from 'react'
import styles from './Temperature.module.css'
export function Temperature({ temp }: { temp: number | undefined }) {

	const fahrenheit = <span className={styles.fahrenheit_symbol}>°<sup>F</sup></span>
	return (
		<span className={styles.Temperature}>{temp ? Math.round(temp) : 'N/A'}{fahrenheit}</span>
	)
}
