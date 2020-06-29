// Antd dependencies
import { List, Avatar, Form, Typography } from 'antd'

// Other dependencies
import React, { useEffect, useState } from 'react'

// Local files
import { searchTitle } from '@/services/api'
import { API_URL } from '@/../config/constants'
import './style.less'

export const ListOfSimilarFeeds: React.FC<{ titleValue: string }> = ({ titleValue }): JSX.Element => {
    const [listData, setListData] = useState([])

    const feedListClasses = ['similar-feed-list']
    if (listData.length > 0) feedListClasses.push('show')

    useEffect(() => {
        searchTitle(titleValue).then(({ data }) => {
            setListData(data.attributes.titles)
        }).catch(_error => {return})
        if (titleValue === '') setListData([])
    }, [titleValue])

    return (
        <Form.Item
            className={feedListClasses.join(' ')}
            style={{ marginBottom: listData.length === 0 ? -10 : 10 }}
            wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 17, offset: 7 }
            }}
        >
            <List
                itemLayout="horizontal"
                style={{ display: listData.length > 0 ? 'initial' : 'none' }}
                header={
                    <Typography.Title level={4} style={{ fontSize: 17, marginBottom: -5, marginTop: -20, fontWeight: 'lighter' }}>
                        Feeds that are similar
                    </Typography.Title>
                }
                dataSource={listData}
                size="small"
                renderItem={item => (
                    <List.Item style={{ margin: '5px 0 5px -16px', border: 0 }}>
                        <List.Item.Meta
                            avatar={
                                <a href={`/${item.slug}`} style={{ zIndex: 10 }} target="_blank">
                                    <Avatar shape="square" src={`${API_URL}/v1/title/${item.id}/image`} />
                                </a>}
                            title={
                                <a href={`/${item.slug}`} style={{ zIndex: 10 }} target="_blank">
                                    {item.name}
                                </a>
                            }
                        />
                    </List.Item>
                )}
            />
        </Form.Item>
    )
}
