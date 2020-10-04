// Antd dependencies
import { Card, Select, Typography } from 'antd'

// Other dependencies
import React, { useEffect, useState } from 'react'

// Local files
import { searchTagByName } from '@/services/api'
import { TagSearchingBlockProps } from '@/@types/components/TagSearchingBlock'

export const TagSearchingBlock: React.FC<TagSearchingBlockProps> = (props): JSX.Element => {
	const [tagResult, setTagResult] = useState<any[]>([])
	const [selectedValues, setSelectedValues] = useState<string[]>(props.tagFilter)
	const [noDataMessage, setNoDataMessage] = useState('Enter at least 3 characters to search')

	useEffect(() => {
		setSelectedValues(props.tagFilter)
	}, [props.tagFilter])

	const handleTagSelect = (value: string): void => {
		props.setTagFilter(value)
	}

	const handleTagSearching = (value: string): void => {
		if (value.length < 3) {
			setTagResult([])
			setNoDataMessage('Enter at least 3 characters to search')
		}

		else {
			searchTagByName(value).then(({ data }) => {
				const result = []

				data.attributes.tags.map(tag => {
					result.push(<Select.Option key={tag._id} value={tag.name}>{tag.name}</Select.Option>)
				})

				if (result.length === 0) setNoDataMessage('Couldn\'t find any tag')
				else setTagResult(result)
			})
		}
	}

	const handleDeSelect = (tag: string) => {
		props.beforeTagDeSelect()
		const updatedList = selectedValues.filter(value => value !== tag)
		props.updateTagFilterList(updatedList.toString())
	}

	const handleOnTagClear = () => {
		props.beforeTagDeSelect()
		setTagResult([])
		setNoDataMessage('Enter at least 3 characters to search')
		props.updateTagFilterList('')
	}

	return (
		<Card className="blockEdges" style={{ marginBottom: 5 }} bordered={false}>
			<Typography.Title level={4} style={{ fontWeight: 'normal' }}> Search & Filter Tags </Typography.Title>
			<Select
				allowClear
				notFoundContent={
					<Typography.Text style={{ width: '100%' }}>{noDataMessage}</Typography.Text>
				}
				onClear={handleOnTagClear}
				mode="multiple"
				style={{ width: '100%' }}
				placeholder="write tags that interests you"
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
