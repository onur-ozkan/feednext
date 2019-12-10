import React, { useState, Dispatch, SetStateAction } from 'react'
import { Layout, Menu, Icon, Input, Button, Modal, Cascader, Divider, Select } from 'antd'

const { Sider } = Layout

const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hanzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake'
                    }
                ]
            }
        ]
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men'
                    }
                ]
            }
        ]
    }
]

export const SiderComponent: React.FunctionComponent = () => {
    const [collapsed, setCollapsed]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)
    const [siderWidth, setSiderWith]: [string, Dispatch<SetStateAction<string>>] = useState('250')
    const [isSearching, setIsSearching]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)
    const [isModalVisible, setIsModalVisible]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)
    const [isModal2Visible, setIsModal2Visible]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)

    const handleChange = (): void => setCollapsed(!collapsed)
    const handleModalDisplay = (visible: boolean) => setIsModalVisible(visible)
    const handleModal2Display = (visible: boolean) => setIsModalVisible(visible)

    const products = () => {
        if (!collapsed) {
            return (
                <Menu mode="inline" style={{ padding: '5px' }}>
                    <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                        <Input.Search
                            loading={isSearching}
                            placeholder="Search a feed title"
                            onSearch={(value) => console.log(value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                        <Button style={{ width: '100%' }} onClick={() => setIsModal2Visible(true)} type="primary">
                            Create Feed Title
						</Button>
                        <Modal
                            title="Create a feed title"
                            centered
                            visible={isModal2Visible}
                            onOk={() => setIsModal2Visible(false)}
                            onCancel={() => setIsModal2Visible(false)}
                        >
                            <Cascader
                                placeholder="Choice the category"
                                style={{ width: '100%' }}
                                options={options}
                                onChange={(value) => console.log(value)}
                                changeOnSelect
                            />
                            <Divider dashed style={{ margin: '10px' }} />

                            <Input
                                placeholder="Name of the material, stuff, product or someting like that"
                                style={{ width: '100%' }}
                            />
                        </Modal>
                    </div>
                    <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                        <Button style={{ width: '100%' }} onClick={() => setIsModalVisible(true)} type="dashed">
                            Filter the Feeds
						</Button>
                        <Modal
                            title="Filter the feed flow"
                            centered
                            visible={isModalVisible}
                            onOk={() => setIsModalVisible(false)}
                            onCancel={() => setIsModalVisible(false)}
                        >
                            <Cascader
                                placeholder="Filter by categories"
                                style={{ width: '100%' }}
                                options={options}
                                onChange={(value) => console.log(value)}
                                changeOnSelect
                            />
                            <Divider dashed style={{ margin: '10px' }} />
                            <Input.Search
                                placeholder="Title is like.."
                                onSearch={(value) => console.log(value)}
                                style={{ width: '100%' }}
                            />
                            <Divider dashed style={{ margin: '10px' }} />

                            <Select defaultValue="Option1" style={{ width: '100%' }}>
                                <Select.Option value="Option1">Top Daily</Select.Option>
                                <Select.Option value="Option2">Top Weekly</Select.Option>
                                <Select.Option value="Option3">Top Monthly</Select.Option>
                                <Select.Option value="Option4">Top Yearly</Select.Option>
                                <Select.Option value="Option5">Top All the Time</Select.Option>
                            </Select>
                        </Modal>
                    </div>
                    <Menu.Item key="1">
                        <Icon type="form" />
                        <span> Example Title </span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="form" />
                        <span> Product Exampleasd </span>
                    </Menu.Item>
                </Menu>
            )
        }
    }

    return (
        <Sider
            style={{ overflow: 'scroll', height: '100vh' }}
            theme="light"
            reverseArrow={true}
            collapsible
            breakpoint="sm"
            collapsedWidth="35"
            onBreakpoint={(broken) => (broken ? setSiderWith('100%') : setSiderWith('250'))}
            width={siderWidth}
            collapsed={collapsed}
            onCollapse={handleChange}
        >
            {products()}
        </Sider>
    )
}
