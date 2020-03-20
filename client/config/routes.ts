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
						icon: 'smile',
						path: '/feeds',
						component: './Feeds',
					},
					{
						path: '/feeds/create-feed',
						component: './Feeds/CreateFeed',
					},
					{
						path: '/welcome',
						component: './Welcome',
					},
					{
						path: '/admin',
						name: 'admin',
						icon: 'crown',
						component: './Admin',
						authority: ['admin'],
						routes: [
							{
								path: '/admin/sub-page',
								name: 'sub-page',
								icon: 'smile',
								component: './Welcome',
								authority: ['admin'],
							},
						],
					},
					{
						name: '个人设置',
						icon: 'smile',
						path: '/account/settings',
						component: './Account/Settings',
					},
					{
						name: 'Account',
						icon: 'smile',
						path: '/account',
						component: './Account',
					},
					{
						name: 'Top Feeders',
						icon: 'smile',
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
