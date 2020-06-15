// Antd dependencies
import { Card, Row, Typography, Col } from 'antd'

// Other dependencies
import React from 'react'
import Link from 'next/link'

// Local files
import faqPng from '@/assets/faq.png'
import guidePng from '@/assets/guide.png'
import securityPng from '@/assets/privacyAndSecurity.png'
import rulesPng from '@/assets/rulesAndReporting.png'
import content from './content.json'
import '@/styles/pages/help/style.less'

const helpMenus = [
    { title: 'F.A.Q', logo: faqPng, content: content["f.a.q"] },
    { title: 'Using Feednext', logo: guidePng, content: content.usingFeednext },
    { title: 'Rules & Reporting', logo: rulesPng, content: content.rulesAndReporting },
    { title: 'Privacy & Security', logo: securityPng, content: content.privacyAndSecurity }
]

const handleTopTitleRendering = (titleList: any[]) => {
    return titleList.map(({ title }) => (
        <li style={{ listStyleType: 'circle', marginBottom: 15 }} key={title}>
            <Link href="#">
                <a style={{ fontSize: 17 }}>
                    {title}
                </a>
            </Link>
        </li>
    ))
}

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
                        <ul>
                            {handleTopTitleRendering(menu.content)}
                        </ul>
                    </Card>
                </Col>
            )
        })
    }

    return <Row> {handleMenuRendering()} </Row>
}
