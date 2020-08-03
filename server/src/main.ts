// Nest dependencies
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

// Other dependencies
import * as fastifyCookie from 'fastify-cookie'
import * as fastifyMultipart from 'fastify-multipart'
import * as sentry from '@sentry/node'
import * as helmet from 'fastify-helmet'
import * as compress from 'fastify-compress'

// Local files
import { AppModule } from './app.module'
import { configService } from './shared/Services/config.service'

async function bootstrap() {
    const fastifyAdapter = new FastifyAdapter({
        logger: configService.isProduction() ? false : true,
    })

    fastifyAdapter.enableCors({
        credentials: true,
        origin: configService.isProduction() ? configService.getEnv('APP_DOMAIN') : true
    })

    fastifyAdapter.get('/', (_req, reply) => {
        reply.code(200).header('Content-Type', 'application/json; charset=utf-8').send({
            title: 'feednext: the source of feedbacks',
            description: 'Restful API of feednext.io',
            termsOfService: 'https://raw.githubusercontent.com/feednext/feednext/master/TERMS-CONDITIONS.md',
            contact: {
                name: 'API Support',
                email: 'admin@feednext.io'
            },
            license: {
                name: 'GPLv3',
                url: 'https://raw.githubusercontent.com/feednext/feednext/master/COPYING'
            },
            source: 'https://github.com/feednext/feednext',
            versions: [
                'v1'
            ]
        })
    })

    fastifyAdapter.register(helmet) // Initialize security middleware module 'fastify-helmet'
    fastifyAdapter.register(compress) // Initialize fastify-compress to better handle high-level traffic
    fastifyAdapter.register(fastifyCookie) // Initialize fastify-cookie for cookie manipulation
    fastifyAdapter.register(fastifyMultipart) // Enable multipart data support

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter )
    app.setGlobalPrefix('/api') // Setting base path
    app.useGlobalPipes(new ValidationPipe()) // Initialize global validation

    if (!configService.isProduction()) {
        const options = new DocumentBuilder()
            .setTitle('Feednext API Documentation')
            .setVersion('1.0')
            .addBearerAuth()
            .build()
        const document = SwaggerModule.createDocument(app, options)
        SwaggerModule.setup('/api', app, document)
    } else {
        sentry.init({ dsn: configService.getEnv('SENTRY_DSN') })
    }

    app.listen(Number(configService.getEnv('APP_PORT')) + Number(configService.getEnv('INSTANCE_ID') || 0), '0.0.0.0')
}

bootstrap()
