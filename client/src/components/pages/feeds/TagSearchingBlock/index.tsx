// Antd dependencies
import { Card, Select, Typography, Col, Divider } from 'antd'

// Other dependencies
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { searchTagByName } from '@/services/api'

// Local files

export const TagSearchingBlock = (props): JSX.Element => {
	const [tagResult, setTagResult] = useState<any[]>([])
	const [selectedValues, setSelectedValues] = useState<string[]>(props.tagFilter)

	useEffect(() => {
		setSelectedValues(props.tagFilter)
	}, [props.tagFilter])

	const handleTagSelect = (value: string): void => {
		props.setTagFilter(value)
	}

	const handleTagSearching = (value: string): void => {
		if (value.length > 2) {
			searchTagByName(value).then(({ data }) => {
				const result = []

				data.attributes.tags.map(tag => {
					result.push(<Select.Option key={tag._id} value={tag.name}>{tag.name}</Select.Option>)
				})

				setTagResult(result)
			})
		}
	}

	const handleDeSelect = (tag: string) => {
		const updatedList = selectedValues.filter(value => value !== tag)
		props.updateTagFilterList(updatedList.toString())
	}

	return (
		<Card className="blockEdges" style={{ marginBottom: 5 }} bordered={false} title="Search Tag">
			<Select
				notFoundContent={null}
				mode="multiple"
				style={{ width: '100%' }}
				placeholder="Search.."
				value={selectedValues}
				onSearch={handleTagSearching}
				onSelect={handleTagSelect}
				onDeselect={handleDeSelect}
			>
				{tagResult}
			</Select>
		</Card>
	)
}
