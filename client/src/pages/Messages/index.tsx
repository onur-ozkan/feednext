// Antd dependencies
import { Tabs, Card, Avatar, Button, Typography, Pagination } from 'antd'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { router } from 'umi'

// Local files
import { fetchUsersConversations, deleteConversation } from '@/services/api'
import { API_URL } from '@/../config/constants'
import PageLoading from '@/components/PageLoading'
import ChatScreen from './components/ChatScreen'
import conversationImg from '../../assets/conversation.png'
import styles from './style.less'

const Messages = (params: any): JSX.Element => {
	const [activeKey, setActiveKey] = useState<string | undefined>(params.location.state?.key)
	const [conversationsData, setConversationsData] = useState<[] | null>(null)
	const [paginationValue, setPaginationValue] = useState(0)
	const globalState = useSelector((state: any) => state.global)
	const user = useSelector((state: any) => state.user.attributes.user)

	useEffect(() => {
		fetchUsersConversations(globalState.accessToken, paginationValue)
			.then(({ data }) => setConversationsData(data.attributes))
	}, [paginationValue])

	if (!conversationsData) return <PageLoading />

	const handleConversationDelete = (conversationId: string): void => {
		setActiveKey(undefined)
		deleteConversation(globalState.accessToken, conversationId)
		setConversationsData({
			...conversationsData,
			conversations: [...conversationsData.conversations].filter(item => item._id !== conversationId)
		})
	}

	const handleMessageTabs = (): JSX.Element => {
		const tabPanes = conversationsData.conversations.map((conversation: any) => {
			const recipientUsername = conversation.participants[0] === user.username ?
				conversation.participants[1]
				:
				conversation.participants[0]
			return (
				<Tabs.TabPane
					tab={
						<Avatar
							src={`${API_URL}/v1/user/pp?username=${recipientUsername}`}
						/>
					}
					key={recipientUsername}
				>
					<ChatScreen
						globalState={globalState}
						username={user.username}
						conversationId={conversation._id}
						recipientUsername={recipientUsername}
						deleteConversationFromState={(): void => handleConversationDelete(conversation._id)}
					/>
				</Tabs.TabPane>
			)
		})

		return (
			<>
				<Pagination
					style={{
						position: 'relative',
						top: -10,
						left: -30,
						fontSize: 15,
						padding: '0px 0px 0px 10px'
					}}
					onChange={(page: number): void => setPaginationValue(10 * (page - 1))}
					simple
					hideOnSinglePage
					defaultCurrent={1}
					total={conversationsData.count}
				/>
				<Tabs
					style={{ marginLeft: -25 }}
					className={conversationsData.conversations.length === 0 ? styles.hideMessageBar : undefined}
					activeKey={activeKey}
					tabPosition="left"
					size="small"
					onChange={(tabKey: string): void => setActiveKey(tabKey)}
					animated={false}
				>
					{tabPanes}
					{!activeKey && (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								height: 500
							}}
						>
							<img style={{ opacity: 0.65 }} src={conversationImg} width="150" alt="Conversation Png" />
							<Typography.Paragraph style={{ textAlign: 'center', width: 275 }} strong>
								Direct Messages are private conversations
								between you and other people on Feednext
							</Typography.Paragraph>
							<Button
								shape="round"
								onClick={(): void => router.push('/messages/compose')}
							>
								Start a Conversation
							</Button>
						</div>
					)}
				</Tabs>
			</>
		)
	}

	return (
		<>
			<Card className={styles.globalClass}>
				{handleMessageTabs()}
			</Card>
			<br/>
		</>
	)
}

export default Messages
