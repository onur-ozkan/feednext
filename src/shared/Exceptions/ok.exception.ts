import { Injectable, HttpException, HttpStatus } from '@nestjs/common'

@Injectable()
export class OkException extends HttpException {
    constructor(message: string, id: number, result: object, type: string) {
        super
        ({
            status_code: 200,
            message,
            data: {
                id,
                type,
                attributes: result,
            },
        }, HttpStatus.OK)
    }
}
