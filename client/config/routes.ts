// Local files
import { User, Guest } from './constants'

const authRoutes = {
	path: '/auth',
	component: '../layouts/AuthLayout',
	routes: [
		{
			path: '/auth',
			redirect: '/auth/sign-in',
		},
		{
			path: '/auth/confirmation/email',
			component: './Auth/EmailConfirmation',
		},
		{
			path: '/auth/sign-in',
			component: './Auth/Login',
		},
		{
			path: '/auth/sign-in/forgot-password',
			component: './Auth/ForgotPassword',
		},
		{
			path: '/auth/sign-in/account-recover',
			component: './Auth/AccountRecover'
		},
		{
			path: '/auth/sign-up',
			component: './Auth/Register',
		},
		{
			path: '/auth/sign-up/account-verification',
			component: './Auth/AccountVerification'
		},
		{
			component: '404',
		},
	],
}

const appRoutes = {
	path: '/',
	component: '../middleware/RouteHandler',
	routes: [
		{
			path: '/create-feed',
			component: '../layouts/AppLayout',
			authority: User,
			routes: [
				{
					path: '/create-feed',
					component: './Feeds/CreateFeed',
				},
				{
					component: '404',
				},
			],
		},
		{
			path: '/messages',
			component: '../layouts/AppLayout',
			authority: User,
			routes: [
				{
					path: '/messages',
					component: './Messages',
				},
				{
					path: '/messages/compose',
					component: './Messages/Compose',
				},
				{
					component: '404',
				},
			],
		},
		{
			path: '/settings',
			component: '../layouts/AppLayout',
			authority: User,
			routes: [
				{
					path: '/settings',
					component: './Settings',
				},
				{
					component: '404',
				},
			],
		},
		{
			path: '/',
			component: '../layouts/AppLayout',
			authority: Guest,
			routes: [
				{
					path: '/',
					component: './Feeds',
				},
				{
					path: '/:feedSlug',
					component: './Feeds/Feed',
				},
				{
					path: '/entry/:entryId',
					component: './Entry',
				},
				{
					path: '/user/:username',
					component: './User',
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
}

export const routes = [
	{
		path: '/',
		component: '../layouts/BaseLayout',
		routes: [
			authRoutes,
			appRoutes,
			{
				component: './404',
			},
		],
	},
]
