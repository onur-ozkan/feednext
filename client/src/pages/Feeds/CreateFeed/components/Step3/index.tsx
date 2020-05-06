import { Button, Result, Descriptions } from 'antd'
import React, { useContext } from 'react'
import styles from './index.less'
import StepContext from '../../StepContext'
import { router } from 'umi'

const Step3: React.FC = ({ titleSlugForRouting, feedCreatedSuccessfully }) => {
	const { createTitleFormData, readableCategoryValue, firstEntryForm } = useContext(StepContext)

	const onFinish = (): void => router.push('/feeds')
	const handleOnPostRoute = (): void => router.push(`/feeds/${titleSlugForRouting}`)

	const information = (
		<div className={styles.information}>
			<Descriptions column={1}>
				<Descriptions.Item label="Category">
					{ readableCategoryValue }
				</Descriptions.Item>
				<Descriptions.Item label="Title">
					{ createTitleFormData.name }
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
			<Button onClick={handleOnPostRoute}>Route to Feed</Button>
		</>
	)
	return (
		<>
			{feedCreatedSuccessfully ?
				<Result status="success" title="Published" extra={extra} className={styles.result}>
					{information}
				</Result>
				:
				<Result
					status="error"
					title="Post could not be created"
					className={styles.result}
					extra={
						<Button type="primary"onClick={onFinish}> OK </Button>
					}
				/>
			}
		</>
	)
}

export default Step3
