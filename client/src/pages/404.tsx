import { Button, Result } from 'antd'
import React from 'react'
import { router } from 'umi'

// The 404 result component of antd should be used here,
// But it hasn't been released yet, let's start with a simple one.

const NoFoundPage: React.FC<{}> = () => (
	<Result
		status="404"
		title="404"
		subTitle="Sorry, the page you visited does not exist."
		extra={
			<Button type="primary" onClick={(): void => router.push('/')}>
				Back Home
			</Button>
		}
	/>
)

export default NoFoundPage
