// Antd dependencies
import { Card, Row, Typography, Col } from 'antd'

// Other dependencies
import React from 'react'

// Local files
import faqPng from '@/assets/faq.png'
import guidePng from '@/assets/guide.png'
import securityPng from '@/assets/privacyAndSecurity.png'
import rulesPng from '@/assets/rulesAndReporting.png'
import '@/styles/pages/help/style.less'

const helpMenus = [
    { title: 'F.A.Q', logo: faqPng },
    { title: 'Using Feednext', logo: guidePng },
    { title: 'Privacy & Security', logo: securityPng },
    { title: 'Rules & Reporting', logo: rulesPng },
]

export const HelpMenus = (): JSX.Element => {
	const handleMenuRendering = () => {
        return helpMenus.map(menu => {
            return (
                <Col style={{ padding: '0px 30px 0px 30px' }} md={12} sm={24} xs={24}>
                    <Card
                        title={
                            <Row style={{ alignItems: 'center' }}>
                                <img style={{ marginRight: 10 }} src={menu.logo} width="50" alt="Frequently Asked Questions" />
                                <Typography.Title level={3} ellipsis>
                                    {menu.title}
                                </Typography.Title>
                            </Row>
                        }
                        bordered={false}
                    >
                    </Card>
                </Col>
            )
        })
    }

	return <Row> {handleMenuRendering()} </Row>
}
