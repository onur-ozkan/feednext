// Nest dependencies
import { Controller, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

// Local files
import { RolesGuard } from 'src/shared/Guards/roles.guard'

@ApiTags('v1/message')
@Controller()
@UseGuards(RolesGuard)
export class MessageController {
}
