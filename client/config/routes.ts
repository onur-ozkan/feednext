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
				name: 'login',
				icon: 'smile',
				path: '/user/login',
				component: './user/login',
			},
			{
				name: 'register-result',
				icon: 'smile',
				path: '/user/register-result',
				component: './user/register-result',
			},
			{
				name: 'register',
				icon: 'smile',
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
						path: '/welcome',
						component: './Welcome',
					},
					{
						icon: 'smile',
						path: '/account/settings',
						component: './Account/Settings',
					},
					{
						icon: 'smile',
						path: '/account',
						component: './Account',
					},
					{
						name: 'Top Feeders',
						icon: 'CrownOutlined',
						path: '/top-feeders',
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
