// Antd dependencies
import { Card, Typography, Row } from 'antd'

// Other dependencies
import React from 'react'

// Local files
import { AppLayout } from '@/layouts/AppLayout'
import { PageHelmet } from '@/components/global/PageHelmet'
import topicContent from '@/components/pages/help/content.json'
import NotFoundPage from '@/pages/404'
import faqPng from '@/assets/faq.png'
import guidePng from '@/assets/guide.png'
import securityPng from '@/assets/privacyAndSecurity.png'
import rulesPng from '@/assets/rulesAndReporting.png'
import './style.less'
import { Roles } from '@/enums'

const topicData = {
    'f.a.q': { titleReadable: 'F.A.Q', logo: faqPng },
    'usingFeednext': { titleReadable: 'Using Feednext', logo: guidePng },
    'rulesAndReporting': { titleReadable: 'Rules & Reporting', logo: rulesPng },
    'privacyAndSecurity': { titleReadable: 'Privacy & Security', logo: securityPng }
}

const HelpTopic = (props): JSX.Element => {
    if (!props.topic) return <NotFoundPage />

    const handleTopicBodyView = () => {
        return props.topic.content.map(item => {
            return (
                <ul style={{ marginBottom: 40 }}>
                    <Typography.Title level={4}> {item.subTitle} </Typography.Title>
                    {item.text.map(i => (
                        <li style={{ listStyleType: 'circle', marginBottom: 10 }}>
                            <Typography.Text style={{ fontSize: 16 }}>
                                {i}
                            </Typography.Text>
                        </li>
                    ))}
                </ul>
            )
        })
    }

	return (
        <AppLayout authority={Roles.Guest}>
			<PageHelmet
                title={props.topic.title}
                description="Best reviews, comments, feedbacks about anything around the world"
                keywords="help, guides"
                mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
                mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
            <Card>
                <div className={'fieldBackground'}>
                    <Typography.Title className={'fieldTitle'} >
                        <Row style={{ alignItems: 'center' }}>
                            <img
                                src={props.topicData.logo}
                                alt={props.topicData.titleReadable}
                            />
                            {props.topicData.titleReadable}
                        </Row>
                    </Typography.Title>
                </div>
                <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 50 }}>
                    {props.topic.title}
                </Typography.Title>
                {handleTopicBodyView()}
			</Card>
			<br />
		</AppLayout>
	)
}

HelpTopic.getInitialProps = async (context: any) => {
    const topic = await topicContent[context.query.f]?.find(field => field.slug === context.query['topic-slug'])
    return {
        topicData: topicData[context.query.f],
        topic
    }
}

export default HelpTopic
