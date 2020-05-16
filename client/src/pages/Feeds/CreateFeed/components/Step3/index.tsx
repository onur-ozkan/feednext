// Antd dependencies
import { Button, Result, Descriptions } from 'antd'

// Other dependencies
import React, { useContext } from 'react'
import { history } from 'umi'

// Local files
import StepContext from '../../StepContext'
import styles from './index.less'

const Step3: React.FC = ({ titleSlugForRouting, feedCreatedSuccessfully }) => {
	const { createTitleFormData, readableCategoryValue, firstEntryForm } = useContext(StepContext)

	const onFinish = (): void => history.push('/feeds')
	const handleOnPostRoute = (): void => history.push(`/feeds/${titleSlugForRouting}`)

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
					title="Feed could not created"
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
