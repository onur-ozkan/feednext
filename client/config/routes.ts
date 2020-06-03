export const routes = [
	{
		path: '/',
		component: '../layouts/BaseLayout',
		routes: [
			{
				path: '/test',
				component: './asd/Home'
			},
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
				path: '/create-feed',
				component: './Feeds/CreateFeed',
			},
			{
				path: '/messages',
				component: './Messages',
			},
			{
				path: '/messages/compose',
				component: './Messages/Compose',
			},
			{
				path: '/settings',
				component: './Settings',
			},
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
				component: './404',
			},
		],
	},
]
