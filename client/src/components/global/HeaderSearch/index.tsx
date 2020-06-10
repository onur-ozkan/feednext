// Antd dependencies
import { AutoComplete, Input, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'

// Local files
import { searchTitle } from '@/services/api'
import './style.less'

const HeaderSearch: React.FC = (): JSX.Element => {
	const inputEl = useRef(null)
	const router = useRouter()

	const [value, setValue] = useState('')
	const [searchMode, setSearchMode] = useState(false)
	const [autoCompleteData, setAutoCompleteData] = useState(null)
	const [noDataMessage, setNoDataMessage] = useState('')

	const enterSearchMode = (): void => {
		if (autoCompleteData) return
		setSearchMode(true)
		inputEl.current.focus()
	}

	const leaveSearchMode = (): void => {
		setValue('')
		setSearchMode(false)
	}

	useEffect(() => {
		if (value === '') setAutoCompleteData(null)
		if (value.length < 3) setNoDataMessage('Enter at least 3 characters to search')
		else {
			searchTitle(value).then(res => {
				const foundTitles = res.data.attributes.titles.map(title => {
					return {
						label: <Typography.Text style={{ fontSize: 15.7, width: '100%' }}> {title.name} </Typography.Text>,
						value: title.slug
					}
				})
				if (foundTitles.length === 0) setAutoCompleteData(null)
				else setAutoCompleteData(foundTitles)
				setNoDataMessage('Could not match anything')
			}).catch(_error => {})
		}
	}, [value])

	const handleOnSelect = (titleSlug: string): void => {
		router.replace(`/${titleSlug}`)
		router.reload()
	}

	const inputClass = classNames('input', {
		'show': searchMode,
		'headerSearch': true,
		'search': true,
		'action': true,
	})

	return (
		<div className={inputClass} onClick={enterSearchMode}>
			<AutoComplete
				notFoundContent={
					<Typography.Text strong style={{ width: '100%' }}>{noDataMessage}</Typography.Text>
				}
				backfill
				className={inputClass}
				value={value}
				onChange={(value: string): void => setValue(value)}
				onSelect={handleOnSelect}
				onBlur={leaveSearchMode}
				options={autoCompleteData}
			>
				<Input
					ref={inputEl} placeholder="Search Feeds.."
					onPressEnter={(): void => handleOnSelect(autoCompleteData[0].value)}
					onBlur={leaveSearchMode}
				/>
			</AutoComplete>
			<SearchOutlined
				key="Icon"
			/>
		</div>
	)
}

export default HeaderSearch
