'use client'

import { useState, useEffect } from 'react'
import { LocationData } from '../data/types'

export default function useRecentLocations(localStorageKey: string, initialValue: LocationData[]): [LocationData[], (newLocation: LocationData) => void, (location: LocationData) => void] {
	const [recentLocations, setRecentLocations] = useState<LocationData[]>(initialValue)

	useEffect(() => {
		const localValue = window.localStorage.getItem(localStorageKey)
		console.log('localStorage: ', localValue)

		if (typeof localValue !== 'string') return
		const parsedValue = JSON.parse(localValue) as LocationData[]
		if (parsedValue.length > 0) setRecentLocations(parsedValue)

	}, [])

	useEffect(() => {
		window.localStorage.setItem(localStorageKey, JSON.stringify(recentLocations))
	}, [recentLocations])

	function addLocation(newLocation: LocationData) {
		recentLocations.forEach(location => {
			if (location.lat === newLocation.lat && location.lon === newLocation.lon) {
				return
			}
		})
		// useEffect above, saves to LS when recentLocations changes
		setRecentLocations(oldLocations => [...oldLocations, newLocation])
	}

	function removeLocation(location: LocationData) {
		// useEffect above, saves to LS when recentLocations changes
		setRecentLocations(oldLocations => [...oldLocations.filter(l => l.lat !== location.lat && l.lon !== location.lon)])
	}

	return [recentLocations, addLocation, removeLocation]
}