interface ConversationType {
	_id: string;
	participants: string[];
	unread_messages: [
        { username: string, value: number },
        { username: string, value: number }
    ];
	last_message_send_at: string;
	created_at: string;
	updated_at: string;
}

export interface ConversationResponseType {
    conversations: ConversationType[];
    count: number;
}
