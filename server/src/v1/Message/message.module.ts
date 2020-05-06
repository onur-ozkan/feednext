// Nest dependencies
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Local files
import { MessageService } from './Service/message.service'
import { MessageController } from './Controller/message.controller'
import { MessagesEntity } from 'src/shared/Entities/messages.entity'

@Module({
    imports: [TypeOrmModule.forFeature([MessagesEntity])],
    providers: [MessageService],
    exports: [MessageService],
    controllers: [MessageController],
})

export class MessageModule {}
