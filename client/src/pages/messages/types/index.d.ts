import { GlobalState } from '@/@types/store'
import { ConversationListDataResponse } from '@/@types/api'

export interface ConversationAttributes {
	_id: string,
	created_at: string,
	deleted_from: string[]
	last_message_send_at: string,
	participants: string[]
	unread_messages: { username: string, value: number }[]
	updated_at: string
}

export interface MessageAttributes {
	_id: string,
	conversation_id: string,
	created_at: string,
	send_by: string,
	text: string,
	updated_at: string
}

export interface ChatScreenProps {
	conversationId: string,
	username: string,
	recipientUsername: string,
	globalState: GlobalState,
	wss: SocketIOClient.Socket,
	deleteConversation: () => void
}

export interface ConversationListProps {
	activeConversationId: string | undefined,
	username: string,
	currentConversations: {
		conversations: ConversationAttributes[],
		count: number
	},
	globalState: GlobalState,
	wss: SocketIOClient.Socket,
	setActiveConversation: React.Dispatch<React.SetStateAction<ConversationAttributes | undefined>>,
	setRecipientUsername: React.Dispatch<string | undefined>,
	setCurrentConversations: React.Dispatch<ConversationListDataResponse>
}

export interface MessageHeaderProps {
	title: string,
	onDelete: () => void
}
