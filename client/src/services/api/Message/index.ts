import axios, { AxiosResponse } from 'axios'

export const fetchUsersConversations = (
	accessToken: string,
	skip: number
): Promise<AxiosResponse> => axios.get(
	'/v1/message/conversations', {
		headers: {
			'Authorization': `Bearer ${accessToken}`,
		},
		params: {
			skip
		}
	}
)

export const fetchMessagesByConversationId = (
	accessToken: string,
	conversationId: string,
	skip: number
): Promise<AxiosResponse> => axios.get(
	`/v1/message/${conversationId}/messages`, {
		headers: {
			'Authorization': `Bearer ${accessToken}`,
		},
		params: {
			skip
		}
	}
)

export const fetchUnreadMessageInfo = (accessToken: string): Promise<AxiosResponse> => axios.get(
	'/v1/message/unread-message-info', {
		headers: {
			'Authorization': `Bearer ${accessToken}`,
		}
	}
)

export const deleteConversation = (
	accessToken: string,
	conversationId: string
): Promise<AxiosResponse> => axios.delete(`/v1/message/${conversationId}`, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})
