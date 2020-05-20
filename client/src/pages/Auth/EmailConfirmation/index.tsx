// Antd dependencies
import { Result } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState, useEffect } from 'react'

// Local files
import { PageHelmet } from '@/components/PageHelmet'
import { verifyUpdatedEmail } from '@/services/api'
import NotFoundPage from '@/pages/404'
import styles from './style.less'

const EmailConfirmation: React.FunctionComponent = (props: any) => {
	const [isRequestSucceess, setIsRequestSucceess] = useState<boolean | null>(null)

	if (!props.location.query?.token) return <NotFoundPage />

	useEffect(() => {
		verifyUpdatedEmail(props.location.query?.token).then(() => {
			setIsRequestSucceess(true)
			setTimeout(() => {
				location.href = '/auth/sign-in'
			}, 2500)
		}).catch(() => {
			setIsRequestSucceess(false)
			setTimeout(() => {
				location.href = '/auth/sign-in'
			}, 2500)
		})
	}, [])


	return (
		<>
			<PageHelmet
				title="Email Confirmation | Feednext"
				description="Best reviews, comments, feedbacks about anything around the world"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<div className={styles.main}>
				{isRequestSucceess === null ?
					(
						<div style={{ display: 'flex', height: 500, justifyContent: 'center', alignItems: 'center' }}>
							<LoadingOutlined style={{ fontSize: 25 }} />
						</div>
					)
					:
					(
						<Result
							status={isRequestSucceess ? 'success' : 'error'}
							title={isRequestSucceess ? 'Email Updated Successfully' : 'Email Update Failed'}
						/>
					)
			}
			</div>
		</>
	)
}

export default EmailConfirmation
