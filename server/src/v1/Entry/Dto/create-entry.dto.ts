// Nest dependencies
import { ApiModelProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, IsMongoId } from 'class-validator'

export class CreateEntryDto {
    @ApiModelProperty({
        required: true,
        example: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
    })
    @IsNotEmpty()
    text: string

    @ApiModelProperty({
        required: true,
        example: `507f1f77bcf86cd799439011`,
    })
    @IsNotEmpty()
    @IsMongoId()
    titletId: string
}
