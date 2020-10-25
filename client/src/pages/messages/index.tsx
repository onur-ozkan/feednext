// Antd dependencies
import { Card } from 'antd'

// Other dependencies
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

// Local files
import { socketConnection } from '@/services/socket.service'
import { deleteConversation } from '@/services/api'
import { ConversationList } from '@/components/pages/messages/ConversationList'
import { ChatScreen } from '@/components/pages/messages/ChatScreen/index'
import { WelcomePage } from '@/components/pages/messages/WelcomePage'
import { PageHelmet } from '@/components/global/PageHelmet'
import { ConversationAttributes } from '@/@types/pages'
import { AppLayout } from '@/layouts/AppLayout'
import './style.less'
import { Roles } from '@/enums'

const Messages = (): JSX.Element => {
	const [currentConversations, setCurrentConversations] = useState<{
		conversations: ConversationAttributes[],
		count: number
	} | any>(null)
	const [activeConversation, setActiveConversation] = useState<ConversationAttributes | undefined>(undefined)
	const [recipientUsername, setRecipientUsername] = useState<string | any>(undefined)

	const userState = useSelector((state: any) => state.user?.attributes.user)
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
		<AppLayout authority={Roles.User}>
			<PageHelmet
				title="Direct Messages"
				description="Best reviews, comments, feedbacks about anything around the world"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			{userState && (
				<>
					<Card style={{ height: 825 }} className={'container'}>
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
					<br />
				</>
			)}
		</AppLayout>
	)
}

export default Messages
