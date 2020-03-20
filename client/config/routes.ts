export const routes = [
	{
		path: '/user',
		component: '../layouts/UserLayout',
		routes: [
			{
				path: '/user',
				redirect: '/user/login',
			},
			{
				path: '/user/login',
				component: './user/login',
			},
			{
				path: '/user/register-result',
				component: './user/register-result',
			},
			{
				path: '/user/register',
				component: './user/register',
			},
			{
				component: '404',
			},
		],
	},
	{
		path: '/',
		component: '../layouts/SecurityLayout',
		routes: [
			{
				path: '/',
				component: '../layouts/BasicLayout',
				authority: ['admin', 'user'],
				routes: [
					{
						path: '/',
						redirect: '/feeds',
					},
					{
						name: 'Feeds',
						icon: 'CopyFilled',
						path: '/feeds',
						component: './Feeds',
					},
					{
						path: '/feeds/create-feed',
						component: './Feeds/CreateFeed',
						authority: ['admin', 'user'],
					},
					{
						path: '/account',
						component: './Account',
					},
					{
						path: '/account/settings',
						component: './Account/Settings',
					},
					{
						name: 'Top Feeders',
						icon: 'CrownOutlined',
						path: 'top-feeders',
						component: './top-feeders',
					},
					{
						component: './404',
					},
				],
			},
			{
				component: './404',
			},
		],
	},
	{
		component: './404',
	},
]
