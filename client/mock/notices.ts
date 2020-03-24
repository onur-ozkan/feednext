import { Request, Response } from 'express'

const getNotices = (req: Request, res: Response) => {
	res.json([
		{
			id: '000000001',
			avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
			title: 'You received 14 new weekly reports',
			datetime: '2017-08-09',
			type: 'notification',
		},
		{
			id: '000000002',
			avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
			title: 'You recommended Qu Nini passed the third round of interviews',
			datetime: '2017-08-08',
			type: 'notification',
		},
		{
			id: '000000003',
			avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
			title: 'This template can distinguish multiple notification types',
			datetime: '2017-08-07',
			read: true,
			type: 'notification',
		},
		{
			id: '000000004',
			avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
			title: 'This template can distinguish multiple notification types',
			datetime: '2017-08-07',
			type: 'notification',
		},
		{
			id: '000000005',
			avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
			title: 'This template can distinguish multiple notification types',
			datetime: '2017-08-07',
			type: 'notification',
		},
		{
			id: '000000006',
			avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
			title: 'This template can distinguish multiple notification types',
			description: 'You recommended Qu Nini passed the third round of interviews',
			datetime: '2017-08-07',
			type: 'message',
			clickClose: true,
		},
		{
			id: '000000007',
			avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
			title: 'This template can distinguish multiple notification types',
			description: 'You recommended Qu Nini passed the third round of interviews',
			datetime: '2017-08-07',
			type: 'message',
			clickClose: true,
		},
		{
			id: '000000008',
			avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
			title: 'This template can distinguish multiple notification types',
			description: 'You recommended Qu Nini passed the third round of interviews',
			datetime: '2017-08-07',
			type: 'message',
			clickClose: true,
		},
		{
			id: '000000009',
			title: 'This template can distinguish multiple notification types',
			description: 'You recommended Qu Nini passed the third round of interviews',
			extra: 'has not started',
			status: 'todo',
			type: 'event',
		},
		{
			id: '000000010',
			title: 'This template can distinguish multiple notification types',
			description: 'You recommended Qu Nini passed the third round of interviews',
			extra: 'has not started',
			status: 'urgent',
			type: 'event',
		},
		{
			id: '000000011',
			title: 'This template can distinguish multiple notification types',
			description: 'You recommended Qu Nini passed the third round of interviews',
			extra: 'has not started',
			status: 'doing',
			type: 'event',
		},
		{
			id: '000000012',
			title: 'This template can distinguish multiple notification types',
			description: 'You recommended Qu Nini passed the third round of interviews',
			extra: 'has not started',
			status: 'processing',
			type: 'event',
		},
	])
}

export default {
	'GET /api/notices': getNotices,
}
