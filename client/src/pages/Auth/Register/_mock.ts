import { Request, Response } from 'express'

export default {
	'POST  /api/register': (_: Request, res: Response): void => {
		res.send({
			status: 'ok',
			currentAuthority: 'user',
		})
	},
}
