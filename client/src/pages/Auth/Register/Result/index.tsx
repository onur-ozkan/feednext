import { Button, Result, Typography } from 'antd'
import Link from 'umi/link'
import React from 'react'

const { Paragraph, Text } = Typography

const actions = (
	<>
		<Link to="/feeds">
			<Button style={{ width: '15rem' }} size="large">
				Send Again
			</Button>
		</Link>
	</>
)

const RegisterResult = props => {
	const signedAccount = props.signedAccount
	return (
		<Result
			status="success"
			title={<h2>Hey {signedAccount.full_name},</h2>}
			subTitle={
				<Paragraph>
					<Text
						strong
						style={{
							fontSize: 20,
						}}
					>
						Your account verification mail has been sent to{' '}
						<span style={{ color: '#5199FF' }}>{signedAccount.email}</span>, please check your mails and do the
						verification to sign in.
					</Text>
				</Paragraph>
			}
			extra={actions}
		></Result>
	)
}

export default RegisterResult
