import React, { useState, useEffect } from 'react'
import { Tabs, Card, Avatar, Button, Typography } from 'antd'
import ChatScreen from './ChatScreen'
import conversationImg from '../../../assets/conversation.png'
import { router } from 'umi'
import { fetchUsersConversations } from '@/services/api'
import { useSelector } from 'react-redux'
import PageLoading from '@/components/PageLoading'
import { API_URL } from '@/../config/constants'

const MessageTabs: React.FC = (params) => {
	const [activeKey, setActiveKey] = useState<string | undefined>(params.activeKey || undefined)
	const [conversationList, setConversationList] = useState<[] | null>(null)
	const globalState = useSelector((state: any) => state.global)
	const user = useSelector((state: any) => state.user.attributes.user)

	useEffect(() => {
		fetchUsersConversations(globalState.accessToken, 0)
			.then(({ data }) => {
				setConversationList(data.attributes)
			})
	}, [])

	if (!conversationList) return <PageLoading />

	const handleMessageTabs = (): JSX.Element => {
		const tabs = conversationList.map((conversation: any) => {
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
					key={conversation._id}
				>
					<ChatScreen
						globalState={globalState}
						username={user.username}
						conversationId={conversation._id}
						recipientUsername={recipientUsername}
					/>
				</Tabs.TabPane>
			)
		})

		return (
			<Tabs
				style={{ marginLeft: -25 }}
				activeKey={activeKey}
				tabPosition="left"
				size="small"
				onChange={(tabKey: string): void => setActiveKey(tabKey)}
				animated={false}
			>
				{tabs}
				{!activeKey && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							minHeight: 500,
						}}
					>
						<img src={conversationImg} width="150" alt="Conversation Png" />
						<Typography.Paragraph style={{ textAlign: 'center', width: 275 }} strong>
							Direct Messages are private conversations
							between you and other people on Feednext.
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
		)
	}

	return (
		<Card>
			{handleMessageTabs()}
		</Card>
	)
}

export default MessageTabs
