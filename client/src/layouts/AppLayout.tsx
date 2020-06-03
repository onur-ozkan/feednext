// Antd dependencies
import { Row, Col } from 'antd'
import { MenuDataItem, Settings } from '@ant-design/pro-layout'

// Other dependencies
import React from 'react'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import Link from 'next/link'

// Local files
import RightContent from '@/components/GlobalHeader/RightContent'
import RouteHandler from '@/middleware/RouteHandler'
import defaultSettings from '@/../config/defaultSettings'
import logoWide from '../assets/logo-wide.svg'
import logoSquare from '../assets/logo-square.svg'
import '../global.less'

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
export type AppLayoutContext = { [K in 'location']: AppLayoutProps } & {
	breadcrumbNameMap: {
		[path: string]: MenuDataItem
	}
}

const ProLayout = dynamic(() => import('@ant-design/pro-layout'), {
	ssr: false
})

const AppLayout: React.FC<AppLayoutProps> = props => {
	const settings = useSelector((state: any) => state.settings)

	return (
		<RouteHandler authority={props.authority}>
			<ProLayout
				{...defaultSettings}
				collapsedButtonRender={false}
				logo={
					<picture>
						<source media="(max-width: 768px)" srcSet={logoSquare}/>
						<source style={{ marginLeft: 15 }} media="(min-width: 767px)" srcSet={logoWide} />
						<img src={logoWide} />
					</picture>
				}
				menuHeaderRender={(logoDom): JSX.Element => (
					<Link href="/">
						{logoDom}
					</Link>
				)}
				rightContentRender={(): JSX.Element => <RightContent />}
			>
				<Row style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
					<Col xxl={16} xl={20} lg={22} md={22} sm={24}>
						{props.children}
					</Col>
				</Row>
			</ProLayout>
		</RouteHandler>
	)
}

export default AppLayout
