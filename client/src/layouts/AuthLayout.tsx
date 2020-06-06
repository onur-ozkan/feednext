// Antd dependencies
import { Layout, Typography } from 'antd'

// Other dependencies
import React from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// Local files
import logo from '@/assets/logo-square.svg'
import './AuthLayout.less'

const AuthLayout: React.FC = props => {
	const router = useRouter()
	const user = useSelector((state: any) => state.user)

	if (user && (router.route === '/auth/sign-in' || router.route === '/auth/sign-up')) {
		router.push('/')
		return null
	} else {
		return (
			<div className={'container'}>
				<div className={'content'}>
					<div className={'top'}>
						<div className={'header'}>
							<a href="/">
								<img alt="logo" className={'logo'} src={logo} />
								<span className={'title'}>Feednext</span>
							</a>
						</div>
						<div className={'desc'} />
					</div>
					{props.children}
				</div>
				<Layout.Footer style={{ background: 'transparent', textAlign: 'center' }}>
					<Typography.Text>
						Feednext © 2020. All rights reserved
					</Typography.Text>
				</Layout.Footer>
			</div>
		)
	}
}

export default AuthLayout
