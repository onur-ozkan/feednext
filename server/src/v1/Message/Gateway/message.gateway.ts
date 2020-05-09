// Nest dependencies
import { Logger } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'

// Other dependencies
import * as jwt from 'jsonwebtoken'
import { Server } from 'socket.io'

// Local files
import { configService } from 'src/shared/Services/config.service'
import { MessageService } from '../Service/message.service'

@WebSocketGateway({
    transport: ['websocket'],
    // origins: configService.getEnv('APP_DOMAIN'),
})
export class MessageGateway {
    constructor(
        private readonly messageService: MessageService,
    ) {}

    @WebSocketServer() wss: Server
    private logger = new Logger('MessageGateway')

    async handleConnection(socket: SocketIO.Socket) {
        const { Authorization } = socket.handshake.query
        let client

        try {
            client = jwt.verify(Authorization.split(' ')[1], configService.getEnv('SECRET_FOR_ACCESS_TOKEN'))
        } catch (error) {
            socket.disconnect(true)
            this.logger.error('Client disconnected')
        }

        if (!client) return

        socket.join(client.username)
        socket.on('sendMessage', async (messageForm: { recipient: string; body: string }) => {
            try {
                await this.messageService.sendMessage({
                    ...messageForm,
                    from: client.username
                })
                socket.to(messageForm.recipient).emit('pingMessage', {
                    from: client.username,
                    body: messageForm.body
                })
            } catch (error) {
                this.logger.error('Message could not send')
            }
        })
    }
}