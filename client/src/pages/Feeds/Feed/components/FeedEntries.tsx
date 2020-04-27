import React from 'react'
import { Tooltip, List, Comment, Card, Avatar, message, Typography, Button, Popconfirm } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons'
import AddEntry from './AddEntry'
import { useSelector, useDispatch } from 'react-redux'
import { voteEntry, undoEntryVote, updateEntry } from '@/services/api'
import { VOTE_ENTRY, UNDO_ENTRY_VOTE } from '@/redux/Actions/User/types'
import { router } from 'umi'
import { SuperAdmin } from '@/../config/constants'

const FeedEntries: React.FC = ({ titleData, entryList, handleEntryFetching, setEntryList, accessToken }): JSX.Element => {
	const dispatch = useDispatch()
	const userState = useSelector((state: any) => state.user?.attributes.user)

	const paginationOptions = {
		size: 'small',
		showLessItems: true,
		showQuickJumper: true,
		pageSize: 7,
		total: titleData.attributes.entry_count,
		onChange: (page: number): void => {
			handleEntryFetching(7 * (page - 1))
		},
	}

	const isEntryAlreadyVoted = (entryId: string, from: 'up' | 'down'): boolean => {
		if (!userState) return false

		if (from === 'up') return userState.up_voted_entries.includes(entryId)
		return userState.down_voted_entries.includes(entryId)
	}

	const handleEntryRouting = (entryId: string): void => router.push(`/entry/${entryId}`)

	const handleVoteEntry = async (entryId: string, voteTo: 'up' | 'down'): Promise<void> => {
		if (!userState) return // TODO pop sign in window

		const entry = entryList.entries.find((entry) => entry.id === entryId)
		const isAlreadyUpVoted = isEntryAlreadyVoted(entryId, 'up')
		const isAlreadyDownVoted = isEntryAlreadyVoted(entryId, 'down')

		if (isAlreadyUpVoted) {
			dispatch({
				type: UNDO_ENTRY_VOTE,
				from: 'up',
				entryId
			})
			entry.votes--
			await undoEntryVote(entryId, accessToken, true).catch(error => message.error(error.response.data.message))
		} else if (isAlreadyDownVoted) {
			dispatch({
				type: UNDO_ENTRY_VOTE,
				from: 'down',
				entryId
			})
			entry.votes++
			await undoEntryVote(entryId, accessToken, false).catch(error => message.error(error.response.data.message))
		}

		if ((isAlreadyUpVoted && voteTo === 'up') || (isAlreadyDownVoted && voteTo === 'down')) return

		(voteTo === 'up') ? entry.votes++ : entry.votes--

		dispatch({
			type: VOTE_ENTRY,
			entryId: entryId,
			voteTo: voteTo
		})

		await voteEntry(entryId, voteTo, accessToken).catch(error => {
			dispatch({
				type: UNDO_ENTRY_VOTE,
				from: voteTo,
				entryId
			})
			message.error(error.response.data.message)
		})
	}

	const handleEntryUpdate = (value: string, entry: any): void => {
		if (value === entry.text) return

		updateEntry(entry.id, value, accessToken)
			.then(_res => {
				setEntryList({
					...entryList,
					entries: [...entryList.entries].map(item => {
						if (item.id === entry.id) {
							return {
								...item,
								text: value
							}
						}
						else return item
					})
				})
				message.success('Entry successfully updated')
			})
			.catch(error => {
				if (error.response) message.error(error.response.data.error)
			})
	}

	const handleEntryActions = (item: number): JSX.Element[] => [
		<span style={{ padding: '2px 5px 2px 5px', fontSize: 14, opacity: 1 }} key="comment-basic-like">
			<Tooltip title="Up Vote">
				<ArrowUpOutlined onClick={() => handleVoteEntry(item.id, 'up')} style={{ color: (isEntryAlreadyVoted(item.id, 'up')) ? 'red' : 'black' }} />
			</Tooltip>
			<span style={{ color: '#818181', fontSize: 15 }} className="comment-action"> {item.votes} </span>
			<Tooltip title="Down Vote">
				<ArrowDownOutlined onClick={() => handleVoteEntry(item.id, 'down')} style={{ color: (isEntryAlreadyVoted(item.id, 'down')) ? 'red' : 'black' }} />
			</Tooltip>
		</span>
	]

	return (
		<Card bordered={false}>
			<List
				pagination={paginationOptions}
				className="comment-list"
				header={`${titleData.attributes.entry_count} Entries`}
				itemLayout="horizontal"
				dataSource={entryList.entries}
				renderItem={item => (
					<>
						<Comment
							actions={handleEntryActions(item)}
							author={
								<span onClick={(): void => router.push(`/user/${item.written_by}`)} style={{ cursor: 'pointer' }}>
									{item.written_by}
								</span>
							}
							avatar={ <Avatar style={{ verticalAlign: 'middle' }} size="large">
							{item.written_by.toUpperCase()[0]}
						  </Avatar>}
							content={
								<>
									<Typography.Paragraph
										{...item.written_by === userState.username && { editable: {
											onChange: (value: string): void => handleEntryUpdate(value, item)
										}}}
									>
										{item.text}
									</Typography.Paragraph>
									{(item.written_by === userState.username || userState.role === SuperAdmin) &&
										<span style={{ float: 'right'}}>
											<Popconfirm
												placement="leftBottom"
												style={{ fontSize: 15 }}
												icon={<InfoCircleOutlined style={{ color: 'red' }} />}
												title="Are you sure that you want to delete this entry?"
												onConfirm={(): void => {return}}
												okText="Yes"
												cancelText="No"
											>
												<Button type="link" danger icon={<DeleteOutlined style={{ fontSize: 14 }} />} />
											</Popconfirm>
										</span>
									}
								</>
							}
							datetime={
								<span
									onClick={(): void => handleEntryRouting(item.id)}
									style={{ cursor: 'pointer' }}
								>
									{item.created_at}
								</span>
							}
						/>
					</>
				)}
			/>
			{userState &&
				<AddEntry
					setEntryList={setEntryList}
					titleId={titleData.attributes.id}
					accessToken={accessToken}
				/>
			}
		</Card>
	)
}

export default FeedEntries
