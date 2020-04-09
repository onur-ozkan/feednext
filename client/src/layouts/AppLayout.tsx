import ProLayout, { MenuDataItem, Settings, DefaultFooter } from '@ant-design/pro-layout'
import React, { useEffect } from 'react'
import { Link } from 'umi'
import { Dispatch } from 'redux'
import { Row, Col } from 'antd'
import { formatMessage } from 'umi-plugin-react/locale'

import RightContent from '@/components/GlobalHeader/RightContent'
import { checkIsUserExpired } from '@/services/utils'
import logo from '../assets/logo.svg'
import { Route } from 'antd/lib/breadcrumb/Breadcrumb'
import { GithubFilled } from '@ant-design/icons'
import { useSelector } from 'react-redux'

export declare interface AppLayoutProps {
	breadcrumbNameMap: {
		[path: string]: MenuDataItem
	}
	route: {
		authority: string[]
	}
	settings: Settings
	dispatch: Dispatch
}
export type AppLayoutContext = { [K in 'location']: AppLayoutProps[K] } & {
	breadcrumbNameMap: {
		[path: string]: MenuDataItem
	}
}

const handleFooterRendering = (): JSX.Element => (
	<DefaultFooter
		copyright="2019 Ilter Technology"
		style={{ backgroundColor: 'transparent' }}
		links={[
			{
				key: 'Github',
				title: <GithubFilled />,
				href: 'https://github.com/ilter-tech',
				blankTarget: true,
			},
		]}
	/>
)

const AppLayout: React.FC<AppLayoutProps> = props => {
	const settings = useSelector((state: any) => state.settings)
	const user = useSelector((state: any) => state.user)

	useEffect(() => {
		if (user) checkIsUserExpired(user.attributes.access_token)
	}, [])

	return (
		<ProLayout
			logo={logo}
			menuHeaderRender={(logoDom, titleDom): JSX.Element => (
				<Link to="/">
					{logoDom}
					{titleDom}
				</Link>
			)}
			menuItemRender={(menuItemProps, defaultDom): React.ReactNode => {
				if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
					return defaultDom
				}
				return <Link to={menuItemProps.path}>{defaultDom}</Link>
			}}
			breadcrumbRender={(routers = []): Route[] => [
				{
					path: '/',
					breadcrumbName: formatMessage({
						id: 'menu.home',
						defaultMessage: 'Home',
					}),
				},
				...routers,
			]}
			itemRender={(route, params, routes, paths): JSX.Element => {
				const first = routes.indexOf(route) === 0
				return first ? (
					<Link to={paths.join('/')}>{route.breadcrumbName}</Link>
				) : (
					<span>{route.breadcrumbName}</span>
				)
			}}
			footerRender={handleFooterRendering}
			formatMessage={formatMessage}
			rightContentRender={(): JSX.Element => <RightContent />}
			{...props}
			{...settings}
		>
			<Row style={{ backgroundColor: 'transparent' }}>
				<Col span={18} offset={3}>
					{props.children}
				</Col>
			</Row>
		</ProLayout>
	)
}

export default AppLayout
