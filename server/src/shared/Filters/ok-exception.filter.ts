// Nest dependencies
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'

@Injectable()
export class OkException extends HttpException {
    constructor(type: string, result: object, message: string = `OK`, id?: string) {
        super
        ({
            status_code: 200,
            message,
            data: {
                type,
                id,
                attributes: result,
            },
        }, HttpStatus.OK)
    }
}
