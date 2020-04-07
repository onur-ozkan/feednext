// Nest dependencies
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

// Other dependencies
import * as fastifyCookie from 'fastify-cookie'
import * as apm from 'swagger-stats'
import * as fastifyRateLimit from 'fastify-rate-limit'
import * as helmet from 'fastify-helmet'
import * as compress from 'fastify-compress'

// Local files
import { AppModule } from './app.module'
import { configService } from './shared/Services/config.service'

declare const module: any
async function bootstrap() {
    const fastifyAdapter = new FastifyAdapter({
        logger: (configService.getEnv('MODE')) === 'PROD' ? false : true,
    })

    fastifyAdapter.enableCors({
        credentials: true,
        origin: true
    })

    // Set request limit as 1 for per second
    fastifyAdapter.register(fastifyRateLimit, {
        max: 60,
        timeWindow: 60 * 1000,
        whitelist: ['127.0.0.1'],
    })

    fastifyAdapter.register(helmet) // Initialize security middleware module 'fastify-helmet'
    fastifyAdapter.register(compress) // Initialize fastify-compress to better handle high-level traffic
    fastifyAdapter.register(fastifyCookie) // Initialize fastify-cookie for cookie manipulation

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter )

    app.setGlobalPrefix('/api') // Setting base path

    app.useGlobalPipes(new ValidationPipe()) // Initialize global validation

    // Configure the Swagger API Doc
    const options = new DocumentBuilder()
        .setTitle('Feednext API Documentation')
        .setVersion('1.0')
        .setBasePath('api')
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('/api', app, document)

    // Configure the APM
    const apmConfig = {
        authentication: true,
        onAuthenticate(_req, username, password) {
            return(
                (username === configService.getEnv('APM_USERNAME')) && (password === configService.getEnv('APM_PASSWORD'))
            )
        },
        uriPath: '/api/status',
        version: '0.95.11',
    }

    app.use(apm.getMiddleware(apmConfig)) // Initialize APM

    app.listen(configService.getEnv('APP_PORT'), '0.0.0.0')

    if (module.hot) {
        module.hot.accept()
        module.hot.dispose(() => app.close())
    }
}

bootstrap()
