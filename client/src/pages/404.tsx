// Antd dependencies
import { Button, Result } from 'antd'

// Other dependencies
import React from 'react'
import { history } from 'umi'

const NotFoundPage: React.FC<{}> = () => (
	<Result
		status="404"
		title="404"
		subTitle="Sorry, the page you visited does not exist."
		extra={
			<Button type="primary" onClick={(): void => history.push('/')}>
				Back Home
			</Button>
		}
	/>
)

export default NotFoundPage
