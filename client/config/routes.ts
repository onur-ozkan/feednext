export const routes = [
	{
		path: '/auth',
		component: '../layouts/UserLayout',
		routes: [
			{
				path: '/auth',
				redirect: '/auth/sign-in',
			},
			{
				path: '/auth/sign-in',
				component: './Auth/Login',
			},
			{
				path: '/auth/sign-up/result',
				component: './Auth/Register/Result',
			},
			{
				path: '/auth/sign-up',
				component: './Auth/Register',
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
						path: '/feeds/feed',
						component: './Feeds/Feed',
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
						component: './TopFeeders',
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
