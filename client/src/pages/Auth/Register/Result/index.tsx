// Antd dependencies
import { Result, Typography } from 'antd'

// Other dependencies
import React from 'react'

const RegisterResult = props => {
	const signedAccount = props.signedAccount
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
						Your account verification mail has been sent to{' '}
						<span style={{ color: '#5199FF' }}>{signedAccount.email}</span>, please check your mails and do the
						verification to sign in.
					</Typography.Text>
				</Typography.Paragraph>
			}
		/>
	)
}

export default RegisterResult
