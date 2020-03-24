import React from 'react'

import { Input } from 'antd'
import styles from './PhoneView.less'

declare interface PhoneViewProps {
	value?: string
	onChange?: (value: string) => void
}

const PhoneView: React.FC<PhoneViewProps> = props => {
	const { value, onChange } = props
	let values = ['', '']
	if (value) {
		values = value.split('-')
	}

	return (
		<>
			<Input
				className={styles.area_code}
				value={values[0]}
				onChange={(e): void => {
					if (onChange) {
						onChange(`${e.target.value}-${values[1]}`)
					}
				}}
			/>
			<Input
				className={styles.phone_number}
				onChange={(e): void => {
					if (onChange) {
						onChange(`${values[0]}-${e.target.value}`)
					}
				}}
				value={values[1]}
			/>
		</>
	)
}

export default PhoneView
