// Antd dependencies
import { Button, Result } from 'antd'

// Other dependencies
import React from 'react'
import { history } from 'umi'

// Local files
import { PageHelmet } from '@/components/PageHelmet'

const NotFoundPage: React.FC<{}> = () => (
	<>
		<PageHelmet
			title="404 Not Found | Feednext"
			description="Best reviews, comments, feedbacks about anything around the world"
			mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
			mediaDescription="Best reviews, comments, feedbacks about anything around the world"
		/>
		<Result
			status="404"
			title="404"
			subTitle="Sorry, the page you visited does not exist"
			extra={
				<Button type="primary" onClick={(): void => history.push('/')}>
					Back Home
				</Button>
			}
		/>
	</>
)

export default NotFoundPage
