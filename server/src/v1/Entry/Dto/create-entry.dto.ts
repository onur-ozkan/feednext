// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty } from 'class-validator'

export class CreateEntryDto {
    @ApiProperty({
        required: true,
        example: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    })
    @IsNotEmpty()
    text: string

    @ApiProperty({
        required: true,
        example: '5dd44d587d0c680f77d9688e',
    })
    @IsNotEmpty()
    titleId: string
}
