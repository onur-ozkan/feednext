// Nest dependencies
import { Controller, UseGuards, Get, Headers, Query, Param, Delete, HttpException } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

// Local files
import { MessageService } from '../Service/message.service'
import { jwtManipulationService } from 'src/shared/Services/jwt.manipulation.service'
import { ISerializeResponse } from 'src/shared/Services/serializer.service'

@ApiTags('v1/message')
@Controller()
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
    ) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('conversations')
    getConversationListByUsername(
        @Headers('authorization') bearer: string,
        @Query('skip') skip: string
    ): Promise<ISerializeResponse> {
        return this.messageService.getConversationListByUsername(jwtManipulationService.decodeJwtToken(bearer, 'username'), skip)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('unread-message-info')
    getUnreadMessageInfo(
        @Headers('authorization') bearer: string
    ): Promise<ISerializeResponse> {
        return this.messageService.getUnreadMessageInfo(jwtManipulationService.decodeJwtToken(bearer, 'username'))
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get(':conversationId/messages')
    getMessageList(
        @Param('conversationId') conversationId,
        @Headers('authorization') bearer: string,
        @Query('skip') skip: string
    ): Promise<ISerializeResponse> {
        return this.messageService.getMessageListByConversationId(jwtManipulationService.decodeJwtToken(bearer, 'username'), conversationId, skip)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':conversationId')
    deleteMessages(
        @Param('conversationId') conversationId,
        @Headers('authorization') bearer: string,
    ): Promise<HttpException> {
        return this.messageService.deleteMessages(conversationId, jwtManipulationService.decodeJwtToken(bearer, 'username'))
    }
}
