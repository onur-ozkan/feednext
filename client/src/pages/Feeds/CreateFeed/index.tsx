// Antd dependencies
import { Card, Steps, message } from 'antd'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// Local files
import { createTitle, createEntry } from '@/services/api'
import { StepProvider } from './StepContext'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import styles from './style.less'

const CreateFeed: React.FC = () => {
	const accessToken = useSelector((state: any) => state.global.accessToken)
	const categoryTree = useSelector((state: any) => state.global.categoryTree)

	const [currentStep, setCurrentStep] = useState<number>(0)
	const [stepComponent, setStepComponent] = useState<React.ReactNode>(null)
	const [isRequestReady, setIsRequestReady] = useState(false)
	const [readableCategoryValue, setReadableCategoryValue] = useState(null)
	const [firstEntryForm, setFirstEntryForm]: any = useState({
		text: undefined
	})
	const [createTitleFormData, setCreateTitleFormData]: any = useState({
		name: undefined,
		imageBase64: undefined,
		imageFile: undefined,
		categoryId: undefined,
	})

	const [feedCreatedSuccessfully, setFeedCreatedSuccessfully] = useState<boolean | null>(null)
	const [titleSlugForRouting, setTitleSlugForRouting] = useState(null)

	useEffect(() => {
		if (isRequestReady) {
			const titleFormData = new FormData()

			titleFormData.append('name', createTitleFormData.name)
			titleFormData.append('categoryId', createTitleFormData.categoryId)
			if (createTitleFormData.imageFile) titleFormData.append('image', createTitleFormData.imageFile)

			createTitle(titleFormData, accessToken).then((res) => {
				createEntry({
					titleId: res.data.attributes.id,
					text: firstEntryForm.text,
				}, accessToken).catch(error => message.error(error.response.data.message))
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
							setFirstEntryForm={setFirstEntryForm}
							setIsRequestReady={setIsRequestReady}
							stepMovementTo={handleStepMovement}
						/>
				}
			case 'feed-status':
				return {
					step: 2,
					component:
						<Step3
							feedCreatedSuccessfully={feedCreatedSuccessfully}
							titleSlugForRouting={titleSlugForRouting}
						/>
				}
			default:
				return {
					step: 0,
					component:
						<Step1
							stepMovementTo={handleStepMovement}
							categories={categoryTree}
							setCreateTitleFormData={setCreateTitleFormData}
							setReadableCategoryValue={setReadableCategoryValue}
						/>
				}
		}
	}

	if (!stepComponent) handleStepMovement()

	return (
		<StepProvider value={{ createTitleFormData, readableCategoryValue, firstEntryForm }}>
			<Card bordered={false}>
				<Steps current={currentStep} className={styles.steps}>
					<Steps.Step title="Create Title" />
					<Steps.Step title="Enter First Entry" />
					<Steps.Step title="Feed Status" />
				</Steps>
				{stepComponent}
			</Card>
			<br/>
		</StepProvider>
	)
}

export default CreateFeed
