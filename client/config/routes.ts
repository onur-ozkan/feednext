import { User, Guest } from "./constants";

export const routes = [
	{
		path: '/auth',
		component: '../layouts/AuthLayout',
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
		component: '../middleware/RouteHandler',
		routes: [
			{
				path: '/',
				component: '../layouts/AppLayout',
				authority: Guest,
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
						path: '/user/',
						component: './User',
					},
					{
						name: 'Top Feeders',
						icon: 'CrownOutlined',
						path: '/top-feeders',
						component: './TopFeeders',
					},
					{
						component: '404',
					},
				],
			},
			{
				path: '/feeds/create-feed',
				component: '../layouts/AppLayout',
				authority: User,
				routes: [
					{
						path: '/feeds/create-feed',
						component: './Feeds/CreateFeed',
					},
					{
						component: '404',
					},
				],
			},
			{
				path: 'account',
				component: '../layouts/AppLayout',
				authority: User,
				routes: [
					{
						path: '/account',
						component: './Account',
					},
					{
						path: '/account/settings',
						component: './Account/Settings',
					},
					{
						component: '404',
					},
				],
			},
			{
				path: '/feeds/create-feed',
				component: '../layouts/AppLayout',
				authority: User,
				routes: [
					{
						path: '/messages',
						component: './Messages',
					},
					{
						component: '404',
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
