import { Button, Result, Descriptions } from 'antd'
import React, { useContext } from 'react'
import styles from './index.less'
import StepContext from '../../StepContext'
import { router } from 'umi'

const Step3: React.FC = () => {
	const { createTitleForm, readableCategoryValue, firstEntryForm } = useContext(StepContext)

	const onFinish = () => {
		router.push('/feeds')
	}

	const information = (
		<div className={styles.information}>
			<Descriptions column={1}>
				<Descriptions.Item label="Category">
					{ readableCategoryValue }
				</Descriptions.Item>
				<Descriptions.Item label="Title">
					{ createTitleForm.name }
				</Descriptions.Item>
				<Descriptions.Item label="Description">
					{ createTitleForm.description }
				</Descriptions.Item>
				<Descriptions.Item label="Entry">
					{ firstEntryForm.text }
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

export default Step3
