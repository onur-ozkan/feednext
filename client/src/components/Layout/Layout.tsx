import React from 'react'
import { NavbarComponent } from '../Navbar/Navbar'
import { FooterComponent } from '../Footer/Footer'
import { SiderComponent } from '../Sider/Sider'
import { Layout } from 'antd'

const { Content } = Layout

export const LayoutComponent: React.FunctionComponent = (props) => (
    <Layout>
        <NavbarComponent />
        <Layout style={{ background: 'white', overflow: 'scroll', height: '100vh' }}>
            <SiderComponent />
            <Layout style={{ background: 'white' }}>
                <Content
                    style={{
                        background: 'white',
                        padding: 24,
                        margin: 0
                    }}
                >
                    {props.children}
                </Content>
            </Layout>
        </Layout>
        <FooterComponent />
    </Layout>
)
