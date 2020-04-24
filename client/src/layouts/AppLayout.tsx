import ProLayout, { MenuDataItem, Settings, DefaultFooter } from '@ant-design/pro-layout'
import React from 'react'
import { Link } from 'umi'
import { Dispatch } from 'redux'
import { Row, Col } from 'antd'
import { formatMessage } from 'umi-plugin-react/locale'

import RightContent from '@/components/GlobalHeader/RightContent'
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

const AppLayout: React.FC<AppLayoutProps> = props => {
	const settings = useSelector((state: any) => state.settings)

	return (
		<ProLayout
			collapsedButtonRender={false}
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
			formatMessage={formatMessage}
			rightContentRender={(): JSX.Element => <RightContent />}
			{...props}
			{...settings}
		>
			<Row style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
				<Col xxl={12} xl={16} lg={18} md={22} sm={24}>
					{props.children}
				</Col>
			</Row>
		</ProLayout>
	)
}

export default AppLayout
