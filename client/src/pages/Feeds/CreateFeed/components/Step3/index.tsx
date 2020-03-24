import { Button, Result, Descriptions } from 'antd'
import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'dva'
import { StateType } from '../../model'
import styles from './index.less'

declare interface Step3Props {
	data?: StateType['step']
	dispatch?: Dispatch<any>
}

const Step3: React.FC<Step3Props> = props => {
	const { data, dispatch } = props
	if (!data) {
		return null
	}
	const onFinish = () => {
		if (dispatch) {
			dispatch({
				type: 'feedsAndCreateFeed/saveCurrentStep',
				payload: 'info',
			})
		}
	}
	const information = (
		<div className={styles.information}>
			<Descriptions column={1}>
				<Descriptions.Item label="Category"> Phone </Descriptions.Item>
				<Descriptions.Item label="Title"> Xphone Model 7s Plus</Descriptions.Item>
				<Descriptions.Item label="Description">
					{' '}
					Xphone Model 7s Plus is a phone released at 2014, here is the device you can check better
					https://example.com/xphone-model-7s-plus
				</Descriptions.Item>
				<Descriptions.Item label="Entry">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
					dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
					ex ea commodo consequat.
				</Descriptions.Item>
			</Descriptions>
		</div>
	)
	const extra = (
		<>
			<Button type="primary" onClick={onFinish}>
				OK
			</Button>
			<Button>Route to Post</Button>
		</>
	)
	return (
		<Result status="success" title="Published" extra={extra} className={styles.result}>
			{information}
		</Result>
	)
}

export default connect(({ feedsAndCreateFeed }: { feedsAndCreateFeed: StateType }) => ({
	data: feedsAndCreateFeed.step,
}))(Step3)
