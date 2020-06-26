export interface ConversationListDataResponse {
	conversations: {
		_id: string,
		participants: string[]
		created_at?: string,
		deleted_from?: string[]
		last_message_send_at?: string,
		unread_messages?: { username: string, value: number }[]
		updated_at?: string
	}[],
	count: number
}
