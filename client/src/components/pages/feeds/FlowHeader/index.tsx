// Antd dependencies
import { Row, Col, Button, Dropdown, Menu, Typography, Divider } from 'antd'
import { FilterFilled, StarFilled, RiseOutlined, FireFilled, UndoOutlined } from '@ant-design/icons'

// Other dependencies
import React from 'react'

// Local files
import { FlowHeaderProps } from '@/@types/pages'

const FlowHeader: React.FC<FlowHeaderProps> = (props): JSX.Element => {

	const handleSortByIcon = (): JSX.Element | void => {
		switch(props.sortBy){
			case 'top':
				return <RiseOutlined style={{ color: '#188fce' }} />
			case 'hot':
				return <FireFilled style={{ color: 'red' }} />
			default:
				return <StarFilled style={{ color: '#00c853' }} />
		}
	}

	const handleFilterReset = (): void => {
		props.beforeFilterReset()
		props.resetTagFilter()
		props.setSortBy(undefined)
	}

	return (
		<Row style={{ margin: '10px -15px -25px 0', position: 'relative', zIndex: 1 }}>
			<Col />
			<Dropdown
				trigger={['click']}
				overlay={
					<Menu>
						<Menu.Item onClick={(): void => props.setSortBy(undefined)}>
							<Typography.Text>
								<StarFilled style={{ color: '#00c853' }} /> New
							</Typography.Text>
						</Menu.Item>
						<Menu.Item onClick={(): void => props.setSortBy('top')}>
							<Typography.Text>
								<RiseOutlined style={{ color: '#188fce' }} /> Top
							</Typography.Text>
						</Menu.Item>
						<Menu.Item onClick={(): void => props.setSortBy('hot')}>
							<Typography.Text>
								<FireFilled style={{ color: 'red' }} /> Hot
							</Typography.Text>
						</Menu.Item>
					</Menu>
				}
			>
				<Button className={'antBtnLink'} type="link">
					SORT BY {handleSortByIcon()}
				</Button>
			</Dropdown>
			<Button
				onClick={handleFilterReset}
				className={'antBtnLink'}
				type="link"
				style={{ marginRight: 5 }}
				icon={<UndoOutlined />}
			>
				RESET
			</Button>
			<Divider style={{ margin: 5 }} />
		</Row>
	)
}

export default FlowHeader
