// Antd dependencies
import { Result } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { useRouter, NextRouter } from 'next/router'

// Local files
import { PageHelmet } from '@/components/global/PageHelmet'
import { verifyAccount } from '@/services/api'
import NotFoundPage from '@/pages/404'
import AuthLayout from '@/layouts/AuthLayout'
import './style.less'

const AccountVerification: React.FunctionComponent = () => {
	const router: NextRouter & { query: { token?: string } } = useRouter()
	const [isRequestSucceess, setIsRequestSucceess] = useState<boolean | null>(null)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	if (!router.query.token) return <NotFoundPage />

	useEffect(() => {
		verifyAccount(router.query.token).then(() => {
			setIsRequestSucceess(true)
			setTimeout(() => {
				router.push('/auth/sign-in')
			}, 2000)
		}).catch(({ response }) => {
			setIsRequestSucceess(false)
			setErrorMessage(response.data.message)
			setTimeout(() => {
				router.push('/auth/sign-in')
			}, 2000)
		})
	}, [])


	return (
		<AuthLayout>
			<PageHelmet
				title="Account Verification | Feednext"
				description="Best reviews, comments, feedbacks about anything around the world"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<div className={'main'}>
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
							title={isRequestSucceess ? 'Account is Successfully Verified' : errorMessage}
						/>
					)
			}
			</div>
		</AuthLayout>
	)
}

export default AccountVerification
