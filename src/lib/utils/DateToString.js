/**
	Convert Date object's date/time numbers into string representations.

	Days: Sunday, Monday, Tuesday
	Month: Jan, Feb, Mar
	Date: 12/25 (December 25th)
	Time: 12:00 AM, 1:00 AM
*/

import { DAYS_OF_WEEK, MONTHS_OF_YEAR } from "../constants"

/**
 * Take a 0-based index representing a month and returning the month's name.
 * @param {number} monthIndex A number between 0 - 11, where 0 is January and 11 is December
 * @returns {string} - The 1st 3 letters of the months name (i.e. 'Jan', 'Feb', 'Mar', etc.)
 */
export function monthToString(monthIndex) {
	switch (monthIndex) {
		case 0:
			return MONTHS_OF_YEAR.JANUARY
		case 1:
			return MONTHS_OF_YEAR.FEBRUARY
		case 2:
			return MONTHS_OF_YEAR.MARCH
		case 3:
			return MONTHS_OF_YEAR.APRIL
		case 4:
			return MONTHS_OF_YEAR.MAY
		case 5:
			return MONTHS_OF_YEAR.JUNE
		case 6:
			return MONTHS_OF_YEAR.JULY
		case 7:
			return MONTHS_OF_YEAR.AUGUST
		case 8:
			return MONTHS_OF_YEAR.SEPTEMBER
		case 9:
			return MONTHS_OF_YEAR.OCTOBER
		case 10:
			return MONTHS_OF_YEAR.NOVEMBER
		case 11:
			return MONTHS_OF_YEAR.DECEMBER
		default:
			return null
	}
}

/**
 * Takes the seconds since epoch (given from WeatherAPI) and returns 12h formated time
 *
 * 0 = midnight, 23 = 11pm
 *
 * @param {Number} epochSecs - Seconds since epoch
 * @returns {string} - Time without the minutes (i.e. '12:00 AM', '1:00 AM', etc.) 
 */
export function hourToString(epochSecs) {
	const hourNum = new Date(epochSecs * 1000).getHours()

	if (hourNum === 0) return '12 AM'

	if (hourNum <= 12) return hourNum + ' AM'

	return (hourNum - 12) + ' PM'
}

/**
 * Takes the seconds since epoch (given from WeatherAPI) and returns the time
 *
 * @param {Number} epochSecs - Seconds since epoch
 * @returns {string} - Time as <hour>:<minutes> <AM/PM> i.e. '8:11 AM' 
 */
export function minuteToString(epochSecs) {
	const date = getDate(epochSecs)
	const hourNum = date.getHours()

	return `${hourNum}:${date.getMinutes()} ${hourNum < 12 ? 'AM' : 'PM'}`
}

/**
 * Takes the seconds since epoch (given from WeatherAPI) and returns the day formated
 *
 * 0 = 1st of the month
 *
 * @param {Number} epochSecs - Seconds since epoch
 * @return {string} - month/date (if it's May 8th then return '5/8')
 */
export function dateToString(epochSecs) {
	const date = getDate(epochSecs)

	return `${date.getMonth() + 1}/${date.getDate()} ` // Leave the space at the end! It's being used in the Daily carasol
}

/**
 * Get the day of the week from the Seconds since epoch
 * @param {number} epochSecs - Seconds since epoch
 * @returns - The day of the week (Sunday, Monday, Tuesday, etc...)
 */
export function dayToString(epochSecs) {
	const date = getDate(epochSecs)

	switch (date.getDay()) {
		case 0: return DAYS_OF_WEEK.SUNDAY
		case 1: return DAYS_OF_WEEK.MONDAY
		case 2: return DAYS_OF_WEEK.TUESDAY
		case 3: return DAYS_OF_WEEK.WEDNESDAY
		case 4: return DAYS_OF_WEEK.THURSDAY
		case 5: return DAYS_OF_WEEK.FRIDAY
		case 6: return DAYS_OF_WEEK.SATURDAY
		default: return 'Unknownday'
	}
}

/**
 * Returns a Date object after multiplying the epochSecs by 1000. 
 * @param {number} epochSecs - Seconds since epoch 
 * @returns {Date} - Returns a new Date object
 */
function getDate(epochSecs) {
	// multiply by 1000 to turn the Seconds into MiliSeconds
	return new Date(epochSecs * 1000)
}