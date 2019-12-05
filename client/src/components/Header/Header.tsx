import React from 'react'
import {Nav} from '../Nav/Nav'
import { Layout } from 'antd'

const { Header } = Layout

const HeaderComponent: React.FunctionComponent = (props): JSX.Element => {

    return (
        <Header style={{background: 'white', height: '55px'}} className="header">
            <Nav/>
        </Header>
    )
}

export { HeaderComponent }