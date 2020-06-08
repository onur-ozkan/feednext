// Nest dependencies
import { Module } from '@nestjs/common'

// Local files
import { SitemapController } from './Controller/sitemap.controller'

@Module({
    controllers: [SitemapController]
})

export class SitemapModule {}
