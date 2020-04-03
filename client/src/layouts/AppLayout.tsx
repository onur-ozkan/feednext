/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, { MenuDataItem, Settings, DefaultFooter } from '@ant-design/pro-layout'
import React, { useEffect } from 'react'
import { Link } from 'umi'
import { Dispatch } from 'redux'
import { connect } from 'dva'
import { Result, Button, Row, Col } from 'antd'
import { formatMessage } from 'umi-plugin-react/locale'

import RightContent from '@/components/GlobalHeader/RightContent'
import { ConnectState } from '@/models/connect'
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils'
import logo from '../assets/logo.svg'
import { Route } from 'antd/lib/breadcrumb/Breadcrumb'
import { GithubFilled } from '@ant-design/icons'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

const noMatch = (
	<Result
		status="403"
		title="403"
		subTitle="Sorry, you are not authorized to access this page."
		extra={
			<Button type="primary">
				<Link to="/auth/sign-in">Go Login</Link>
			</Button>
		}
	/>
)

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

const defaultFooterDom = (
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

const footerRender = () => {
	if (!isAntDesignPro()) {
		return defaultFooterDom
	}
	return (
		<>
			{defaultFooterDom}
			<div
				style={{
					padding: '0px 24px 24px',
					textAlign: 'center',
				}}
			>
				<a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
					<img
						src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
						width="82px"
						alt="netlify logo"
					/>
				</a>
			</div>
		</>
	)
}

const AppLayout: React.FC<AppLayoutProps> = props => {
	const {
		dispatch,
		children,
		settings,
	} = props
	/**
	 * constructor
	 */

	useEffect(() => {
		if (dispatch) {
			dispatch({
				type: 'user/fetchCurrent',
			})
		}
	}, [])
	/**
	 * init variables
	 */
	const handleMenuCollapse = (payload: boolean): void => {
		if (dispatch) {
			dispatch({
				type: 'global/changeLayoutCollapsed',
				payload,
			})
		}
	}

	return (
		<Provider store={store}>
			<ProLayout
				logo={logo}
				menuHeaderRender={(logoDom, titleDom): JSX.Element => (
					<Link to="/">
						{logoDom}
						{titleDom}
					</Link>
				)}
				onCollapse={handleMenuCollapse}
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
				footerRender={footerRender}
				formatMessage={formatMessage}
				rightContentRender={(): JSX.Element => <RightContent />}
				{...props}
				{...settings}
			>
				<Row style={{ backgroundColor: 'transparent' }}>
					<Col span={18} offset={3}>
						{children}
					</Col>
				</Row>
			</ProLayout>
		</Provider>
	)
}

export default connect(({ global, settings }: ConnectState) => ({
	collapsed: global.collapsed,
	settings,
}))(AppLayout)
