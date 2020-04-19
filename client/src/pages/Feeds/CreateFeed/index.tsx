import React, { useState, useEffect } from 'react'
import { Card, Steps, message } from 'antd'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import styles from './style.less'
import { fetchAllCategories, createTitle, createEntry } from '@/services/api'
import { forgeDataTree } from '@/services/utils'
import { PageLoading } from '@ant-design/pro-layout'
import { StepProvider } from './StepContext'
import { useSelector } from 'react-redux'

const { Step } = Steps

const CreateFeed: React.FC = () => {
	const accessToken = useSelector((state: any) => state.global.accessToken)

	const [currentStep, setCurrentStep] = useState<number>(0)
	const [stepComponent, setStepComponent] = useState<React.ReactNode>(null)
	const [isRequestReady, setIsRequestReady] = useState(false)
	const [categories, setCategories] = useState<any[] | null>(null)
	const [readableCategoryValue, setReadableCategoryValue] = useState(null)
	const [firstEntryForm, setFirstEntryForm]: any = useState({
		text: undefined
	})
	const [createTitleForm, setCreateTitleForm]: any = useState({
		name: undefined,
		categoryId: undefined,
		description: undefined
	})

	const [feedCreatedSuccessfully, setFeedCreatedSuccessfully] = useState<boolean | null>(null)
	const [titleSlugForRouting, setTitleSlugForRouting] = useState(null)

	useEffect(() => {
		fetchAllCategories().then(res => {
			const forgedCategories = forgeDataTree(res.data.attributes.categories)
			setCategories(forgedCategories)
		})
	}, [])

	useEffect(() => {
		if (isRequestReady) {
			createTitle(createTitleForm, accessToken).then((res) => {
				createEntry({
					titleSlug: res.data.attributes.slug,
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
							categories={categories}
							setCreateTitleForm={setCreateTitleForm}
							setReadableCategoryValue={setReadableCategoryValue}
						/>
				}
		}
	}

	if (!categories) return <PageLoading/>

	if (!stepComponent) handleStepMovement()

	return (
		<StepProvider value={{ createTitleForm, readableCategoryValue, firstEntryForm }}>
			<Card bordered={false}>
				<Steps current={currentStep} className={styles.steps}>
					<Step title="Create Title" />
					<Step title="Enter First Entry" />
					<Step title="Feed Status" />
				</Steps>
				{stepComponent}
			</Card>
		</StepProvider>
	)
}

export default CreateFeed
