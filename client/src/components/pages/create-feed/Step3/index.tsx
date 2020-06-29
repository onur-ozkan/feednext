// Antd dependencies
import { Button, Result, Descriptions } from 'antd'

// Other dependencies
import React, { useContext } from 'react'
import { useRouter } from 'next/router'

// Local files
import { PageHelmet } from '@/components/global/PageHelmet'
import { StepContext } from '@/services/step.context.service'
import { Step3Props } from '@/@types/pages'
import '@/styles/components/StepForm/style.less'

const Step3 = ({ titleSlugForRouting, feedCreatedSuccessfully }: Step3Props): JSX.Element => {
	const router = useRouter()
	const { createTitleFormData, readableCategoryValue, firstEntryForm } = useContext(StepContext)

	const onFinish = () => router.push('/')
	const handleOnPostRoute = () => router.push('/[feed]', `/${titleSlugForRouting}`)

	const information = (
		<div className={'information'}>
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
			<PageHelmet
				title="Feed Status"
				description="Best reviews, comments, feedbacks about anything around the world"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			{feedCreatedSuccessfully ?
				<Result status="success" title="Published" extra={extra} className={'result'}>
					{information}
				</Result>
				:
				<Result
					status="error"
					title="Feed could not created"
					className={'result'}
					extra={
						<Button type="primary"onClick={onFinish}> OK </Button>
					}
				/>
			}
		</>
	)
}

export default Step3
