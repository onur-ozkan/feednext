import React from 'react'
import { Tooltip, List, Comment, Card, Avatar, message } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import AddEntry from './AddEntry'
import { useSelector, useDispatch } from 'react-redux'
import { voteEntry, undoEntryVote } from '@/services/api'
import { VOTE_ENTRY, UNDO_ENTRY_VOTE } from '@/redux/Actions/User/types'

const FeedEntries: React.FC = ({ titleData, entryData, handleEntryFetching, setEntryList, accessToken }): JSX.Element => {
	const dispatch = useDispatch()
	const userState = useSelector((state: any) => state.user.attributes.user)

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
		if (from === 'up') return userState.up_voted_entries.includes(entryId)
		return userState.down_voted_entries.includes(entryId)
	}

	const handleVoteEntry = async (entryId: string, voteTo: 'up' | 'down'): Promise<void> => {
		const entry = entryData.entries.find((entry) => entry.id === entryId)
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

	const entryActions = (item: number): JSX.Element[] => [
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
		<Card>
			<List
				pagination={paginationOptions}
				className="comment-list"
				header={`${titleData.attributes.entry_count} Entries`}
				itemLayout="horizontal"
				dataSource={entryData.entries}
				renderItem={item => (
					<li>
						<Comment
							actions={entryActions(item)}
							author={
								<span style={{ cursor: 'pointer' }}>
									@{item.written_by}
								</span>
							}
							avatar={ <Avatar style={{ verticalAlign: 'middle' }} size="large">
							{item.written_by.toUpperCase()[0]}
						  </Avatar>}
							content={
								<p>{item.text}</p>
							}
							datetime={
								<Tooltip title={`Updated at ${item.updated_at}`}>
									<span>{item.created_at}</span>
								</Tooltip>
							}
						/>
					</li>
				)}
			/>
			<AddEntry setEntryList={setEntryList} titleSlug={titleData.attributes.slug} accessToken={accessToken} />
		</Card>
	)
}

export default FeedEntries
