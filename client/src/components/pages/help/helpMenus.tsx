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
import './style.less'

const helpMenus = [
    { titleReadable: 'F.A.Q', title: 'f.a.q', logo: faqPng },
    { titleReadable: 'Using Feednext', title: 'usingFeednext', logo: guidePng },
    { titleReadable: 'Rules & Reporting', title: 'rulesAndReporting', logo: rulesPng },
    { titleReadable: 'Privacy & Security', title: 'privacyAndSecurity', logo: securityPng }
]

const handleTopTitleRendering = (titleList: any[], field: string) => {
    return titleList.map(({ title, slug }) => (
        <li style={{ listStyleType: 'circle', marginBottom: 15 }} key={title}>
            <Link href={`help/[topic-slug]?f=${field}`} as={`help/${slug}?f=${field}`}>
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
                <Col style={{ padding: '0 30px 0 30px' }} md={12} sm={24} xs={24}>
                    <Card
                        title={
                            <Row style={{ alignItems: 'center' }}>
                                <img style={{ marginRight: 10 }} src={menu.logo} width="50" alt="Frequently Asked Questions" />
                                <Typography.Title level={3} ellipsis>
                                    {menu.titleReadable}
                                </Typography.Title>
                            </Row>
                        }
                        bordered={false}
                    >
                        <ul>
                            {handleTopTitleRendering(content[menu.title], menu.title)}
                        </ul>
                    </Card>
                </Col>
            )
        })
    }

    return <Row> {handleMenuRendering()} </Row>
}
