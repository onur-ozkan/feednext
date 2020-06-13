// Other dependencies
import { readFile, writeFile } from 'fs'
import * as convert from 'xml-js'
import * as glob from 'glob'

export class SitemapManipulationService {

    private setToCoreSitemap(mapIndex: number) {
        const options = { compact: true, ignoreComment: true, spaces: 4 }

        readFile(`${__dirname}/../../../public/sitemaps/sitemap.xml`, (_err, data: any) => {
            if (data) {
                const existingSitemapList = JSON.parse(convert.xml2json(data, options))
                const currentMap = {
                    loc: {
                        _text: `https://server.feednext.io/api/sitemap/sitemap-${mapIndex}.xml`,
                    }
                }
                existingSitemapList.urlset.url.push(currentMap)
                const finalXML = convert.json2xml(existingSitemapList, options)
                writeFile(`${__dirname}/../../../public/sitemaps/sitemap.xml`, finalXML, () => { return })
            }
        })
    }

    addToIndexedSitemap(url: string, date?: string): void {
        glob(`${__dirname}/../../../public/sitemaps/sitemap-*.xml`, {}, (_error, files) => {
            const currentMap = {
                loc: {
                    _text: `https://www.feednext.io/${url}`,
                },
                ...date && {
                    lastmod: {
                        _text: date
                    }
                }
            }

            if (files.length === 0) {
                // @ts-ignore
                const newXml = convert.json2xml({
                    _declaration: { _attributes: { version: '1.0', encoding: 'UTF-8' } },
                    urlset: {
                        _attributes: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
                        url: [currentMap]
                    }
                }, { compact: true, ignoreComment: true, spaces: 4 })
                writeFile(`${__dirname}/../../../public/sitemaps/sitemap-0.xml`, newXml, () => { return })
                this.setToCoreSitemap(0)
            }

            const sitemapIndexList = []
            files.map((file: string) => {
                // @ts-ignore
                sitemapIndexList.push(file.match(/\d/g)[0])
            })
            const latestSitemapIndex = Math.max(...sitemapIndexList)

            readFile(`${__dirname}/../../../public/sitemaps/sitemap-${latestSitemapIndex}.xml`, (_err, data: any) => {
                if (data) {
                    const existingSitemapList = JSON.parse(convert.xml2json(data, { compact: true, ignoreComment: true, spaces: 4 }))
                    if (existingSitemapList.urlset.url.length > 5000) {
                        // @ts-ignore
                        const newXml = convert.json2xml({
                            _declaration: { _attributes: { version: '1.0', encoding: 'UTF-8' } },
                            urlset: {
                                _attributes: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
                                url: [currentMap]
                            }
                        }, { compact: true, ignoreComment: true, spaces: 4 })
                        writeFile(`${__dirname}/../../../public/sitemaps/sitemap-${latestSitemapIndex + 1}.xml`, newXml, () => { return })
                        this.setToCoreSitemap(latestSitemapIndex + 1)
                    } else {
                        existingSitemapList.urlset.url.length > 1 ?
                            existingSitemapList.urlset.url.push(currentMap)
                                : existingSitemapList.urlset.url = [existingSitemapList.urlset.url, currentMap]

                        const finalXML = convert.json2xml(existingSitemapList, { compact: true, ignoreComment: true, spaces: 4 })
                        writeFile(`${__dirname}/../../../public/sitemaps/sitemap-${latestSitemapIndex}.xml`, finalXML, () => { return })
                    }
                }
            })
        })
    }
}

export const sitemapManipulationService = new SitemapManipulationService()
