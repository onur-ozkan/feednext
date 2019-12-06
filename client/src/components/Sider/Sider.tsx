import React, { useState, Dispatch, SetStateAction } from 'react'
import { Layout, Menu, Icon } from 'antd'

const { Sider } = Layout

export const SiderComponent: React.FunctionComponent = () => {

    const [collapsed, setCollapsed]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)

    const handleChange = (): void => setCollapsed(!collapsed)

    const products = () => {
        if (!collapsed) {
            return (
                <Menu defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1">
                        <Icon type="form" />
                        <span> Product Example </span>
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
        <Sider style={{  overflowY: 'scroll', height: '89vh' }} theme="light" collapsible width={'250'} collapsed={collapsed} onCollapse={handleChange}>
            {products()}
        </Sider>
    )
}
