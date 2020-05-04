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

    getPictureBuffer(fileName: string, directory: 'users' | 'titles'): unknown {
        return new Promise((resolve) => {
            this.s3Instance().getObject({
                Bucket: configService.getEnv('AWS_S3_BUCKET'), Key: `${directory}/${fileName}.jpg`
            }, (error, data) => {
                if (error) {
                    this.s3Instance().getObject({
                        Bucket: configService.getEnv('AWS_S3_BUCKET'),
                        Key: `${directory}/default.jpg`
                    }, (_e, data) => {
                        resolve(data.Body)
                    })
                    return
                }
                resolve(data.Body)
            })
        })
    }

    uploadPicture(fileName: string, directory: 'users' | 'titles', file: Buffer): void {
        this.s3Instance().upload({
            Bucket: configService.getEnv('AWS_S3_BUCKET'),
            Key: `${directory}/${fileName}.jpg`,
            Body: file
        }, (error, _data) => {
            if (error) return error
        })
    }

    async renamePicture(newName: string, directory: 'users' | 'titles', oldName: string): Promise<void> {
        await this.s3Instance().copyObject({
            Bucket: configService.getEnv('AWS_S3_BUCKET'),
            CopySource: `feednext/${directory}/${oldName}.jpg`,
            Key: `${directory}/${newName}.jpg`,
        }, (error, _data) => {
            if (error) return error
        }).promise().then(async () => {
            this.s3Instance().deleteObject({
                Bucket: configService.getEnv('AWS_S3_BUCKET'),
                Key: `${directory}/${oldName}.jpg`,
            }, (error, _data) => {
                if (error) return error
            })
        })
    }
}
