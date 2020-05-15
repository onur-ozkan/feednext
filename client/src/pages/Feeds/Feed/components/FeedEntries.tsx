// Antd dependencies
import {
	Tooltip,
	List,
	Comment,
	Card,
	Avatar,
	message,
	Typography,
	Button,
	Popconfirm,
	Row,
	Col,
	Dropdown,
	Menu,
} from 'antd'
import {
	ArrowUpOutlined,
	ArrowDownOutlined,
	DeleteOutlined,
	InfoCircleOutlined,
	DoubleLeftOutlined,
	DoubleRightOutlined,
} from '@ant-design/icons'

// Other dependencies
import { useSelector } from 'react-redux'

// Local files
import React from 'react'
import { router } from 'umi'
import { voteEntry, undoEntryVote, updateEntry, deleteEntry } from '@/services/api'
import { SuperAdmin, API_URL } from '@/../config/constants'
import AddEntry from './AddEntry'
import globalStyles from '@/global.less'

const FeedEntries: React.FC = ({
	titleData,
	sortEntriesBy,
	setSortEntriesBy,
	entryList,
	handleEntryFetching,
	setEntryList,
	accessToken,
}): JSX.Element => {
	const userState = useSelector((state: any) => state.user?.attributes.user)

	const paginationOptions = {
		size: 'small',
		showLessItems: true,
		hideOnSinglePage: true,
		showQuickJumper: true,
		pageSize: 10,
		total: titleData.attributes.entry_count,
		onChange: (page: number): void => {
			handleEntryFetching(10 * (page - 1))
		},
	}

	const handleEntryRouting = (entryId: string): void => router.push(`/entry/${entryId}`)

	const isEntryAlreadyVoted = (votes: any, from: 'up' | 'down'): boolean => {
		if (!userState) return false

		if (from === 'up') return votes.up_voted.includes(userState.username)
		return votes.down_voted.includes(userState.username)
	}

	const handleVoteEntry = async (entry: any, voteTo: 'up' | 'down'): Promise<void> => {
		if (!userState) return // TODO pop sign in window

		const isAlreadyUpVoted = isEntryAlreadyVoted(entry.votes, 'up')
		const isAlreadyDownVoted = isEntryAlreadyVoted(entry.votes, 'down')

		if (isAlreadyUpVoted) {
			entry.votes.value--
			entry.votes.up_voted = entry.votes.up_voted.filter((item: any) => item !== userState.username)

			await setEntryList({
				...entryList,
				entries: [...entryList.entries].map(item => {
					if (item.id === entry.id) {
						return {
							...entry,
						}
					} else return item
				}),
			})
			await undoEntryVote(entry.id, accessToken, true).catch(error => message.error(error.response.data.message))
		} else if (isAlreadyDownVoted) {
			entry.votes.value++
			entry.votes.down_voted = entry.votes.down_voted.filter((item: any) => item !== userState.username)

			await setEntryList({
				...entryList,
				entries: [...entryList.entries].map(item => {
					if (item.id === entry.id) {
						return {
							...entry,
						}
					} else return item
				}),
			})
			await undoEntryVote(entry.id, accessToken, false).catch(error => message.error(error.response.data.message))
		}

		if ((isAlreadyUpVoted && voteTo === 'up') || (isAlreadyDownVoted && voteTo === 'down')) return

		setEntryList({
			...entryList,
			entries: [...entryList.entries].map(item => {
				if (item.id === entry.id) {
					return {
						...item,
						votes: {
							...item.votes,
							value: voteTo === 'up' ? item.votes.value + 1 : item.votes.value - 1,
							...(voteTo === 'up'
								? { up_voted: [...item.votes.up_voted, userState.username] }
								: { down_voted: [...item.votes.down_voted, userState.username] }),
						},
					}
				} else return item
			}),
		})

		await voteEntry(entry.id, voteTo, accessToken).catch(error => {
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
								text: value,
							}
						} else return item
					}),
				})
				message.success('Entry successfully updated')
			})
			.catch(error => {
				if (error.response) message.error(error.response.data.message)
			})
	}

	const handleEntryDelete = (entryId: string): void => {
		deleteEntry(entryId, accessToken)
			.then(_res => {
				setEntryList({
					...entryList,
					entries: [...entryList.entries].filter(item => item.id !== entryId),
				})
				message.success('Entry successfully deleted')
			})
			.catch(error => message.error(error.response.data.message))
	}

	const handleEntryActions = (item: any): JSX.Element[] => [
		<span style={{ padding: '2px 5px 2px 5px', fontSize: 14, opacity: 1 }} key="comment-basic-like">
			<Tooltip title="Up Vote">
				<ArrowUpOutlined
					onClick={() => handleVoteEntry(item, 'up')}
					style={{ color: isEntryAlreadyVoted(item.votes, 'up') ? 'red' : 'black' }}
				/>
			</Tooltip>
			<span style={{ color: '#818181', fontSize: 15, marginLeft: 2, marginRight: 2 }} className="comment-action">
				{item.votes.value}
			</span>
			<Tooltip title="Down Vote">
				<ArrowDownOutlined
					onClick={() => handleVoteEntry(item, 'down')}
					style={{ color: isEntryAlreadyVoted(item.votes, 'down') ? 'red' : 'black' }}
				/>
			</Tooltip>
		</span>,
	]

	const handleSortByIcon = (): JSX.Element | void => {
		switch (sortEntriesBy) {
			case 'newest':
				return <DoubleRightOutlined />
			case 'top':
				return <ArrowUpOutlined />
			default:
				return <DoubleLeftOutlined />
		}
	}

	return (
		<Card bordered={false}>
			<List
				pagination={paginationOptions}
				className="comment-list"
				header={
					<Row>
						<Col>{titleData.attributes.entry_count} Entries</Col>
						<Dropdown
							trigger={['click']}
							overlay={
								<Menu>
									<Menu.Item onClick={(): void => setSortEntriesBy(null)}>
										<Typography.Text>
											<DoubleLeftOutlined /> Oldest
										</Typography.Text>
									</Menu.Item>
									<Menu.Item onClick={(): void => setSortEntriesBy('newest')}>
										<Typography.Text>
											<DoubleRightOutlined /> Newest
										</Typography.Text>
									</Menu.Item>
									<Menu.Item onClick={(): void => setSortEntriesBy('top')}>
										<Typography.Text>
											<ArrowUpOutlined /> Higher Vote
										</Typography.Text>
									</Menu.Item>
								</Menu>
							}
						>
							<Button className={globalStyles.antBtnLink} type="link">
								SORT BY {handleSortByIcon()}
							</Button>
						</Dropdown>
					</Row>
				}
				itemLayout="horizontal"
				dataSource={entryList.entries}
				renderItem={(item: any): JSX.Element => (
					<>
						<Comment
							actions={handleEntryActions(item)}
							author={
								<Typography.Text
									onClick={(): void => router.push(`/user/${item.written_by}`)}
									style={{ cursor: 'pointer', fontSize: 15, color: '#414141' }}
								>
									{item.written_by}
								</Typography.Text>
							}
							avatar={
								<Avatar
									onClick={(): void => router.push(`/user/${item.written_by}`)}
									src={`${API_URL}/v1/user/pp?username=${item.written_by}`}
								/>
							}
							content={
								<>
									<Typography.Paragraph
										{...(userState?.username === item.written_by && {
											editable: {
												onChange: (value: string): void => handleEntryUpdate(value, item),
											},
										})}
									>
										{item.text}
									</Typography.Paragraph>
									{(userState?.username === item.written_by || userState?.role === SuperAdmin) && (
										<span style={{ float: 'right' }}>
											<Popconfirm
												placement="leftBottom"
												style={{ fontSize: 15 }}
												icon={<InfoCircleOutlined style={{ color: 'red' }} />}
												title="Are you sure that you want to delete this entry?"
												onConfirm={(): void => handleEntryDelete(item.id)}
												okText="Yes"
												cancelText="No"
											>
												<Button
													type="link"
													danger
													icon={<DeleteOutlined style={{ fontSize: 14 }} />}
												/>
											</Popconfirm>
										</span>
									)}
								</>
							}
							datetime={
								<span onClick={(): void => handleEntryRouting(item.id)} style={{ cursor: 'pointer' }}>
									{item.created_at}
								</span>
							}
						/>
					</>
				)}
			/>
			{userState && (
				<AddEntry setEntryList={setEntryList} titleId={titleData.attributes.id} accessToken={accessToken} />
			)}
		</Card>
	)
}

export default FeedEntries
