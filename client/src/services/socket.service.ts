// Other dependencies
import io, { SocketIOClient } from 'socket.io-client'

// Local files
import { SOCKET_URL } from '@/../config/constants'

export const socketConnection = (accessToken: string): SocketIOClient.Socket => io.connect(SOCKET_URL, {
	query: {
		Authorization: `Bearer ${accessToken}`,
	},
	transports: ['websocket'],
	rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false,
	reconnection: true
})
