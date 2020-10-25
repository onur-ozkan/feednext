// Antd dependencies
import { Button, Result } from 'antd'

// Other dependencies
import React from 'react'
import { useRouter } from 'next/router'

// Local files
import { AppLayout } from '@/layouts/AppLayout'
import { PageHelmet } from '@/components/global/PageHelmet'
import { Roles } from '@/enums'

const NotFoundPage: React.FC<{}> = () => {
	const router = useRouter()
	return (
		<AppLayout authority={Roles.Guest}>
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
					<Button type="primary" onClick={() => router.push('/')}>
						Back Home
					</Button>
				}
			/>
		</AppLayout>
	)
}

export default NotFoundPage
