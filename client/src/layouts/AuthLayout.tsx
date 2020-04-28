import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout'
import { Helmet } from 'react-helmet'
import { Link } from 'umi'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

import logo from '../assets/logo.svg'
import styles from './AuthLayout.less'
import { GithubFilled } from '@ant-design/icons'

const AuthLayout: React.FC = props => {
	const {
		route = {
			routes: [],
		},
	} = props
	const { routes = [] } = route
	const {
		children,
		location = {
			pathname: '',
		},
	} = props
	const { breadcrumb } = getMenuData(routes)
	const title = getPageTitle({
		pathname: location.pathname,
		breadcrumb,
		formatMessage,
		...props,
	})
	return (
		<>
			<Helmet>
				<title>{title}</title>
				<meta name="description" content={title} />
			</Helmet>

			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.top}>
						<div className={styles.header}>
							<Link to="/">
								<img alt="logo" className={styles.logo} src={logo} />
								<span className={styles.title}>Feednext</span>
							</Link>
						</div>
						<div className={styles.desc} />
					</div>
					{children}
				</div>
				<DefaultFooter
					copyright="2019 Feednext"
					style={{
						backgroundColor: 'transparent',
					}}
					links={[
						{
							key: 'Github',
							title: <GithubFilled />,
							href: 'https://github.com/ilter-tech',
							blankTarget: true,
						},
					]}
				/>
			</div>
		</>
	)
}

export default AuthLayout
