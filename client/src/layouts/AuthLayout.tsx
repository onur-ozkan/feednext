// Antd dependencies
import { Layout, Typography } from 'antd'

// Other dependencies
import React from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'

// Local files
import { withTranslation } from '@/../i18n'
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
							<Link href="/">
								<a>
									<img className={'logo'} src={logo} alt="App Logo" />
									<span className={'title'}>Feednext</span>
								</a>
							</Link>
						</div>
						<div className={'desc'} />
					</div>
					{props.children}
				</div>
				<Layout.Footer style={{ background: 'transparent', textAlign: 'center' }}>
					<Typography.Text>
						{props.t("authLayout:copyright")}
					</Typography.Text>
				</Layout.Footer>
			</div>
		)
	}
}

export default withTranslation('authLayout')(AuthLayout)
