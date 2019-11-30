// Nest dependencies
import { ApiModelProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, IsMongoId, MaxLength, IsOptional } from 'class-validator'

export class UpdateProductDto {
    @ApiModelProperty({
        required: true,
        example: 'Example Name',
    })
    @IsNotEmpty()
    @MaxLength(60)
    name: string

    @ApiModelProperty({
        required: false,
        example: '507f1f77bcf86cd799439011',
    })
    @IsOptional()
    @IsMongoId()
    categoryId: string
}
