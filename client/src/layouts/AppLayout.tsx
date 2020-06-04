// Antd dependencies
import { Row, Col, Layout, Menu } from 'antd'

// Other dependencies
import React from 'react'

// Local files
import RightContent from '@/components/GlobalHeader/RightContent'
import RouteHandler from '@/middleware/RouteHandler'
import logoWide from '../assets/logo-wide.svg'
import logoSquare from '../assets/logo-square.svg'

const AppLayout: React.FC = props => {
	return (
		<RouteHandler authority={props.authority}>
			<Layout>
				<Layout.Header style={{ position: 'fixed', zIndex: 2, width: '100%'  }}>
					<div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: 64, position: 'absolute', left: 10 }}>
						<a href="/">
							<picture>
								<source media="(max-width: 768px)" srcSet={logoSquare} />
								<source style={{ marginLeft: 15 }} media="(min-width: 767px)" srcSet={logoWide} />
								<img className="navBarlogo" src={logoWide} />
							</picture>
						</a>
					</div>
					<Menu theme="dark" mode="horizontal">
						<RightContent />
					</Menu>
				</Layout.Header>
				<Layout.Content>
					<Row style={{ backgroundColor: 'transparent', justifyContent: 'center', marginTop: 75 }}>
						<Col xxl={16} xl={20} lg={22} md={22} sm={24} xs={24}>
							{props.children}
						</Col>
					</Row>
				</Layout.Content>
			</Layout>
		</RouteHandler>
	)
}

export default AppLayout
