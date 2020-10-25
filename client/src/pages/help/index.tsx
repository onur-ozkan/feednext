// Antd dependencies
import { Card, Typography } from 'antd'

// Other dependencies
import React from 'react'

// Local files
import { AppLayout } from '@/layouts/AppLayout'
import { PageHelmet } from '@/components/global/PageHelmet'
import { HelpMenus } from '@/components/pages/help/helpMenus'
import { Roles } from '@/enums'

const Help = (): JSX.Element => {

	return (
		<AppLayout authority={Roles.Guest}>
			<PageHelmet
                title="Help | Feednext"
                description="Best reviews, comments, feedbacks about anything around the world"
                keywords="help, guides"
                mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
                mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
            <Card>
                <div className={'headerBackground'}>
                    <Typography.Title className={'headerTitle'} >
                        How can we help you ?
                    </Typography.Title>
                </div>
                <HelpMenus />
			</Card>
			<br />
		</AppLayout>
	)
}

export default Help
