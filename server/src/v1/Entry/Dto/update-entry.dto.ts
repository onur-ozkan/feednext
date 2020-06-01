// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, Length } from 'class-validator'

export class UpdateEntryDto {
    @ApiProperty({
        required: true,
        example: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    })
    @Length(2, 650)
    @IsNotEmpty()
    text: string
}
