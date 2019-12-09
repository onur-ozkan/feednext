import React, { useState, Dispatch, SetStateAction } from 'react'
import { Layout, Menu, Icon, Input, Button } from 'antd'

const { Sider } = Layout

export const SiderComponent: React.FunctionComponent = () => {
    const [collapsed, setCollapsed]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)
    const [siderWidth, setSiderWith]: [string, Dispatch<SetStateAction<string>>] = useState('250')
    const [isSearching, setIsSearching]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)

    const handleChange = (): void => setCollapsed(!collapsed)

    const products = () => {
        if (!collapsed) {
            return (
                <Menu mode="inline" style={{ padding: '5px' }}>
                    <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                        <Input.Search
                            loading={isSearching}
                            placeholder="Search a feed title"
                            onSearch={(value) => console.log(value)}
                            style={{ width: 235 }}
                        />
                    </div>
                    <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                        <Button style={{ width: 235 }} onClick={() => console.log('asd')} type="primary">
                            Create Feed Title
						</Button>
                    </div>
                    <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                        <Button style={{ width: 235 }} onClick={() => console.log('asd')} type="dashed">
                            Filter the Feeds
						</Button>
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
            onBreakpoint={(broken) => broken ? setSiderWith('100%') : setSiderWith('250')}
            width={siderWidth}
            collapsed={collapsed}
            onCollapse={handleChange}
        >
            {products()}
        </Sider>
    )
}
