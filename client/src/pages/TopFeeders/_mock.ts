import { Request, Response } from 'express'
import { BasicListItemDataType } from './data'

const titles = ['Alipay', 'Angular', 'Ant Design', 'Ant Design Pro', 'Bootstrap', 'React', 'Vue', 'Webpack']
const avatars = [
	'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
	'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
	'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
	'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
	'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
	'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
	'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
	'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
]

const covers = [
	'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
	'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
	'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
	'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
]
const desc = [
	'It ’s an inner thing, they ca n’t reach it, they ca n’t touch it.',
	'Hope is a good thing, maybe the best, good things will not die out',
	'Life is like a box of chocolates, often with unexpected results',
	'There are so many pubs in town, but she just walked into my pub',
	'At that time, I only thought about what I wanted and never wanted to own.',
]

const user = [
	'Pay little',
	'song Lili',
	'Lin Dongdong',
	'Zhou Xingxing',
	'Wu Jiahao',
	'Zhu right',
	'Fish sauce',
	'Le Ge',
	'Tan Xiaoyi',
	'Zhongni',
]

function fakeList(count: number): BasicListItemDataType[] {
	const list = []
	for (let i = 0; i < count; i += 1) {
		list.push({
			id: `fake-list-${i}`,
			owner: user[i % 10],
			title: titles[i % 8],
			avatar: avatars[i % 8],
			cover: parseInt(`${i / 4}`, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)],
			status: ['active', 'exception', 'normal'][i % 3] as 'normal' | 'exception' | 'active' | 'success',
			percent: Math.ceil(Math.random() * 50) + 50,
			logo: avatars[i % 8],
			href: 'https://ant.design',
			updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
			createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i).getTime(),
			subDescription: desc[i % 5],
			description:
				'During the research and development of Zhongtai products, different design specifications and implementation methods will appear, but there are often many similar pages and components, and these similar components will be separated into a set of standard specifications.',
			activeUser: Math.ceil(Math.random() * 100000) + 100000,
			newUser: Math.ceil(Math.random() * 1000) + 1000,
			star: Math.ceil(Math.random() * 100) + 100,
			like: Math.ceil(Math.random() * 100) + 100,
			message: Math.ceil(Math.random() * 10) + 10,
			content:
				'The paragraph indicates: Ant Financial Design platform ant.design, with minimal workload, seamlessly accesses the Ant Financial ecosystem, providing experience solutions that span design and development. Ant Financial Design platform ant.design, with minimal workload, seamlessly connects to the Ant Financial ecosystem, providing experience solutions that span design and development.',
			members: [
				{
					avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
					name: 'Qu Lili',
					id: 'member1',
				},
				{
					avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
					name: 'Wang Zhaojun',
					id: 'member2',
				},
				{
					avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
					name: 'Dong Nana',
					id: 'member3',
				},
			],
		})
	}

	return list
}

let sourceData: BasicListItemDataType[] = []

function getFakeList(req: Request, res: Response): Response {
	const params = req.query

	const count = params.count * 1 || 20

	const result = fakeList(count)
	sourceData = result
	return res.json(result)
}

function postFakeList(req: Request, res: Response): Response {
	const { /* url = '', */ body } = req
	// const params = getUrlParams(url);
	const { method, id } = body
	// const count = (params.count * 1) || 20;
	let result = sourceData || []

	switch (method) {
		case 'delete':
			result = result.filter(item => item.id !== id)
			break
		case 'update':
			result.forEach((item, i) => {
				if (item.id === id) {
					result[i] = {
						...item,
						...body,
					}
				}
			})
			break
		case 'post':
			result.unshift({
				...body,
				id: `fake-list-${result.length}`,
				createdAt: new Date().getTime(),
			})
			break
		default:
			break
	}

	return res.json(result)
}

export default {
	'GET  /api/fake_list': getFakeList,
	'POST  /api/fake_list': postFakeList,
}
