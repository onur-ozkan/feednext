// Antd dependencies
import { Card } from 'antd'

// Other dependencies
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

// Local files
import { socketConnection } from '@/services/socket'
import { deleteConversation } from '@/services/api'
import { ConversationList } from './components/ConversationList'
import { ChatScreen } from './components/ChatScreen/index'
import { WelcomePage } from './components/WelcomePage'
import { PageHelmet } from '@/components/PageHelmet'
import { ConversationAttributes } from './types'
import styles from './index.less'

const Messages = (): JSX.Element => {
	const [currentConversations, setCurrentConversations] = useState<{
		conversations: ConversationAttributes[],
		count: number
	} | any>(null)
	const [activeConversation, setActiveConversation] = useState<ConversationAttributes | undefined>(undefined)
	const [recipientUsername, setRecipientUsername] = useState<string | any>(undefined)

	const userState = useSelector((state: any) => state.user.attributes.user)
	const globalState = useSelector((state: any) => state.global)
	const wss = socketConnection(globalState.accessToken)

	const handleConversationDelete = (): void => {
		setActiveConversation(undefined)
		setRecipientUsername(undefined)
		deleteConversation(globalState.accessToken, activeConversation._id)
		setCurrentConversations({
			conversations: [...currentConversations.conversations].filter(item => item._id !== activeConversation?._id),
			count: currentConversations?.count
		})
	}

	return (
		<div>
			<PageHelmet
				title="Direct Messages"
				description="Best reviews, comments, feedbacks about anything around the world"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<Card style={{ height: 825 }} className={styles['container']}>
				<ConversationList
					wss={wss}
					currentConversations={currentConversations}
					setCurrentConversations={setCurrentConversations}
					setRecipientUsername={setRecipientUsername}
					activeConversationId={activeConversation?._id}
					setActiveConversation={setActiveConversation}
					username={userState.username}
					globalState={globalState}
				/>
				{activeConversation ?
					<ChatScreen
						wss={wss}
						username={userState.username}
						recipientUsername={recipientUsername}
						conversationId={activeConversation._id}
						deleteConversation={handleConversationDelete}
						globalState={globalState}
					/>
					:
					<WelcomePage />
				}
			</Card>
			<br/>
		</div>
	)
}

export default Messages
