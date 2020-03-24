import { Request, Response } from 'express'
import city from './geographic/city.json'
import province from './geographic/province.json'

function getProvince(_: Request, res: Response): Response {
	return res.json(province)
}

function getCity(req: Request, res: Response): Response {
	return res.json(city[req.params.province])
}
export default {
	// Supported values Object with Array
	'GET  /api/currentUser': {
		name: 'Serati Ma',
		avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
		userid: '00000001',
		email: 'antdesign@alipay.com',
		signature: 'Be tolerant to diversity, tolerance is a virtue',
		title: 'Interaction Expert',
		group: 'Ant Financial-Business Group-Platform Platform-Technology Department-UED',
		tags: [
			{
				key: '0',
				label: 'Very Idea',
			},
			{
				key: '1',
				label: 'Focus on design',
			},
			{
				key: '2',
				label: 'Spicy~',
			},
			{
				key: '3',
				label: 'Long legs',
			},
			{
				key: '4',
				label: 'Sister Chuan',
			},
			{
				key: '5',
				label: 'Heiner River',
			},
		],
		notifyCount: 12,
		unreadCount: 11,
		country: 'China',
		geographic: {
			province: {
				label: 'Zhejiang Province',
				key: '330000',
			},
			city: {
				label: 'Hangzhou',
				key: '330100',
			},
		},
		address: '77 Gongzhu Road, Xihu District',
		phone: '0752-268888888',
	},
	'GET  /api/geographic/province': getProvince,
	'GET  /api/geographic/city/:province': getCity,
}
