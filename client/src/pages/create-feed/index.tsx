// Antd dependencies
import { Card, Steps, message } from 'antd'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AxiosError, AxiosResponse } from 'axios'

// Local files
import { createTitle, createEntry, rateTitle } from '@/services/api'
import { CreateTitleFormData } from '@/@types/pages'
import { StepProvider } from '@/services/step.context.service'
import { AppLayout } from '@/layouts/AppLayout'
import Step1 from '@/components/pages/create-feed/Step1'
import Step2 from '@/components/pages/create-feed/Step2'
import Step3 from '@/components/pages/create-feed/Step3'
import './style.less'
import { Roles } from '@/enums'

const CreateFeed: React.FC = () => {
	const accessToken = useSelector((state: any) => state.global.accessToken)

	const [currentStep, setCurrentStep] = useState<number>(0)
	const [stepComponent, setStepComponent] = useState<React.ReactNode>(null)
	const [isRequestReady, setIsRequestReady] = useState(false)
	const [readableTagValue, setReadableTagValue] = useState(undefined)
	const [firstEntryForm, setFirstEntryForm] = useState<{ text: string } | { text: any }>({
		text: undefined
	})
	const [titleRate, setTitleRate] = useState(undefined)
	const [createTitleFormData, setCreateTitleFormData] = useState<CreateTitleFormData>({
		name: undefined,
		imageBase64: undefined,
		imageFile: undefined,
		tags: undefined,
	})

	const [feedCreatedSuccessfully, setFeedCreatedSuccessfully] = useState<boolean | null>(null)
	const [titleSlugForRouting, setTitleSlugForRouting] = useState<string | null>(null)

	useEffect(() => {
		if (isRequestReady) {
			const titleFormData = new FormData()

			titleFormData.append('name', createTitleFormData.name)
			titleFormData.append('tags', createTitleFormData.tags)
			if (createTitleFormData.imageFile) titleFormData.append('image', createTitleFormData.imageFile)

			createTitle(titleFormData, accessToken).then(async (res: AxiosResponse) => {
				await rateTitle(titleRate, res.data.attributes.id, accessToken)
				await createEntry({
					titleId: res.data.attributes.id,
					text: firstEntryForm.text,
				}, accessToken).catch((error: AxiosError) => message.error(error.response?.data.message))
				setTitleSlugForRouting(res.data.attributes.slug)
				setFeedCreatedSuccessfully(true)
			})
			.catch(error => {
				setFeedCreatedSuccessfully(false)
				message.error(error.response.data.message)
			})
		}
	}, [isRequestReady])

	useEffect(() => {
		if (titleSlugForRouting && feedCreatedSuccessfully !== null) {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			handleStepMovement('feed-status')
			setIsRequestReady(false)
		}
	}, [titleSlugForRouting, feedCreatedSuccessfully])

	const handleStepMovement = (_step?: string): void => {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const { step, component } = handleStepComponentRender(_step)
		setStepComponent(component)
		setCurrentStep(step)
	}

	const handleStepComponentRender = (current?: string): any => {
		switch (current) {
			case 'create-entry':
				return {
					step: 1,
					component:
						<Step2
							stepMovementTo={handleStepMovement}
							setTitleRate={setTitleRate}
							setFirstEntryForm={setFirstEntryForm}
							setIsRequestReady={setIsRequestReady}
						/>
				}
			case 'feed-status':
				return {
					step: 2,
					component:
						<Step3
							titleSlugForRouting={titleSlugForRouting}
							feedCreatedSuccessfully={feedCreatedSuccessfully}
						/>
				}
			default:
				return {
					step: 0,
					component:
						<Step1
							stepMovementTo={handleStepMovement}
							setCreateTitleFormData={setCreateTitleFormData}
							setReadableTagValue={setReadableTagValue}
						/>
				}
		}
	}

	if (!stepComponent) handleStepMovement()

	return (
		<AppLayout authority={Roles.User}>
			<StepProvider value={{ createTitleFormData, readableTagValue, firstEntryForm, titleRate }}>
				<Card bordered={false}>
					<Steps current={currentStep} className={'steps'}>
						<Steps.Step title="Create Title" />
						<Steps.Step title="Enter First Entry" />
						<Steps.Step title="Feed Status" />
					</Steps>
					{stepComponent}
				</Card>
				<br/>
			</StepProvider>
		</AppLayout>
	)
}

export default CreateFeed
