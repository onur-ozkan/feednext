// Other dependencies
import io from 'socket.io-client'
import { SOCKET_URL } from '@/../config/constants'

export const socketConnection = (accessToken: string): SocketIOClient.Socket => io.connect(SOCKET_URL, {
	query: {
		Authorization: `Bearer ${accessToken}`,
		transports: ['websocket']
	}
})
