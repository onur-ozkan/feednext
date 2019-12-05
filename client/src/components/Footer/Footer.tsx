import React from 'react'
import { Layout } from 'antd'

const { Footer } = Layout

export const FooterComponent: React.FunctionComponent = props =>
    <Footer style={{ textAlign: 'right', background: '#fff', height: '59px' }}> App Name ©2019 Created by Nimda </Footer>
