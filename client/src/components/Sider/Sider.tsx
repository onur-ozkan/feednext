import React, { useState, Dispatch, SetStateAction } from 'react'
import { Layout, Menu, Icon, Input } from 'antd'

const { Sider } = Layout

export const SiderComponent: React.FunctionComponent = () => {
    const [collapsed, setCollapsed]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)
    const [isSearching, setIsSearching]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)

    const handleChange = (): void => setCollapsed(!collapsed)

    const products = () => {
        if (!collapsed) {
            return (
                <Menu mode="inline" style={{ padding: '5px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                        <Input.Search
                            loading={isSearching}
                            placeholder="Search a feed title"
                            onSearch={(value) => console.log(value)}
                            style={{ width: 200 }}
                        />
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
            style={{ overflowY: 'scroll', height: '89vh' }}
            theme="light"
            collapsible
            collapsedWidth="35"
            width={'250'}
            collapsed={collapsed}
            onCollapse={handleChange}
        >
            {products()}
        </Sider>
    )
}
