// Nest dependencies
import { Controller, Get, Response, Param } from '@nestjs/common'

// Other dependencies
import { createReadStream } from 'fs'

@Controller('sitemap')
export class SitemapController {
	@Get(':filename')
	serveSiteMap(@Response() res, @Param('filename') filename) {
		const xmlMap = createReadStream(`${__dirname}/../../../public/sitemaps/${filename}`)
			.on('error', () => {
				res.code(404).send({ statusCode: 404, message: 'Sitemap not found' })
			})
			.on('open', () => {
				res.header('Content-Type', 'application/xml')
				res.header('Content-Encoding', 'gzip')
				res.send(xmlMap)
			})
	}
}
