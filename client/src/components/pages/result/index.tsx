// Antd dependencies
import { Result, Typography, Button } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

// Other dependencies
import React from 'react'
import { useRouter } from 'next/router'

// Local files
import NotFoundPage from '@/pages/404'

const RegisterResult = props => {
	const router = useRouter()
	const signedAccount = props.signedAccount
	if (!signedAccount) return <NotFoundPage />

	return (
		<Result
			status="success"
			title={<h2>Hey {signedAccount.fullName},</h2>}
			subTitle={
				<Typography.Paragraph>
					<Typography.Text
						strong
						style={{
							fontSize: 20,
						}}
					>
						Your account verification mail has been sent  to{' '}
						<span style={{ color: '#5199FF' }}>{signedAccount.email}</span>, please check your mails (might be in spams) and do the
						verification to sign in. It may take up to 5 minutes for the mail to arrive.
					</Typography.Text>
				</Typography.Paragraph>
			}
			extra={
				<Button onClick={() => router.push('/auth/sign-in')} shape="round" icon={<LoginOutlined />}>
					Sign In
				</Button>
			}
		/>
	)
}

export default RegisterResult
