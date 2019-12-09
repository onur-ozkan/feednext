import React from 'react'
import { HeaderComponent } from '../Header/Header'
import { FooterComponent } from '../Footer/Footer'
import { SiderComponent } from '../Sider/Sider'
import { ProductContentComponent } from '../ProductContent/ProductContent'

import { Layout } from 'antd'

const { Content } = Layout

export const LayoutComponent: React.FunctionComponent = props =>
    <Layout style={{ minHeight: '100vh' }}>
        <HeaderComponent/>
        <Layout style={{background: 'white', overflow: 'scroll', height: '100vh'}}>
        <SiderComponent/>
            <Content
                style={{
                background: 'white',
                padding: 24,
                margin: 0,
                }}
            >
                <ProductContentComponent/>
            </Content>
        </Layout>
        <FooterComponent/>
    </Layout>
