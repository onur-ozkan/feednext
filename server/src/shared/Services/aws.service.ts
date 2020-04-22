// Other dependencies
import * as s3 from 'aws-sdk/clients/s3'

// Local files
import { configService } from './config.service'

export class AwsService {
    private s3Instance() {
        return new s3({
            accessKeyId: configService.getEnv('AWS_S3_ACCESS_KEY'),
            secretAccessKey: configService.getEnv('AWS_S3_SECRET_KEY'),
            region: configService.getEnv('AWS_S3_REGION')
        })
    }

    getPictureBuffer(fileName: string): unknown {
        return new Promise((resolve) => {
            this.s3Instance().getObject({ Bucket: configService.getEnv('AWS_S3_BUCKET'), Key: `${fileName}.jpg`}, (error, data) => {
                if (error) {
                    this.s3Instance().getObject({ Bucket: configService.getEnv('AWS_S3_BUCKET'), Key: 'default.jpg' }, (_e, data) => {
                        resolve(data.Body)
                    })
                    return
                }
                resolve(data.Body)
            })
        })
    }

    uploadPicture(fileName: string, file: Buffer) {
        this.s3Instance().upload({
            Bucket: configService.getEnv('AWS_S3_BUCKET'),
            Key: `${fileName}.jpg`,
            Body: file
        }, (error, _data) => {
            if (error) throw error
        })
    }
}
