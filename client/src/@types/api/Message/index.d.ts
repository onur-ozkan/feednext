export interface ConversationListDataResponse {
	conversations: {
		_id: string,
		created_at: string,
		deleted_from: string[]
		last_message_send_at: string,
		participants: string[]
		unread_messages: { username: string, value: number }[]
		updated_at: string
	}[],
	count: number
}
