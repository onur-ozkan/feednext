// Antd dependencies
import { Button, Result, Descriptions, Typography } from 'antd'

// Other dependencies
import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import stringToColor from 'string-to-color'

// Local files
import { PageHelmet } from '@/components/global/PageHelmet'
import { StepContext } from '@/services/step.context.service'
import { Step3Props } from '@/@types/pages'
import '../style.less'

const Step3 = ({ titleSlugForRouting, feedCreatedSuccessfully }: Step3Props): JSX.Element => {
	const router = useRouter()
	const { createTitleFormData, readableTagValue, firstEntryForm } = useContext(StepContext)

	const onFinish = () => router.push('/')
	const handleOnPostRoute = () => router.push('/[feed]', `/${titleSlugForRouting}`)

	const information = (
		<div className={'information'}>
			<Descriptions column={1}>
				<Descriptions.Item label="Tags">
					{readableTagValue.map(tag => {
						return (
							<div key={tag} className={'custom-tag'} style={{ backgroundColor: stringToColor(tag) }}>
								<Typography.Text style={{ color: (parseInt(stringToColor(tag).replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff', background: (parseInt(stringToColor(tag).replace('#', ''), 16) > 0xffffff / 2) ? '#fff' : '#000', opacity: 0.9 }}>
									#{tag}
								</Typography.Text>
							</div>
						)
					})}
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
