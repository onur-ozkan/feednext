import React from 'react'
import Link from 'next/link'
import SignInComponent from '../src/components/Signin/Signin'
import SignUpComponent from '../src/components/Signup/Signup'

import { Icon, Row, Menu } from 'antd'

interface IComponentState {
    isSignIn: boolean
}

export default class Sign extends React.Component<{}, IComponentState> {
    constructor(props) {
        super(props)
        this.state = {
            isSignIn: true
        }
    }

    private handleSignScreens = () => {
        if (this.state.isSignIn) {
            return <SignInComponent />
        } else {
            return <SignUpComponent />
        }
    }

    render() {
        return (
            <div>
                <Menu defaultSelectedKeys={['signin']} style={{ display: 'flex', justifyContent: 'center', fontSize: '16px' }} mode="horizontal">
                    <Menu.Item key="exit">
                        <Link href="/">
                            <a>
                                <Icon type="left-circle" />
                                Back to App
                            </a>
                        </Link>
                    </Menu.Item>
                    <hr />
                    <Menu.Item onClick={() => this.setState({ isSignIn: false })} key="signup">
                        <Icon style={{ fontSize: '16px' }} type="user-add" />
                        Sign Up
                    </Menu.Item>
                    <Menu.Item onClick={() => this.setState({ isSignIn: true })} key="signin">
                        <Icon style={{ fontSize: '16px' }} type="login" />
                        Sign In
                    </Menu.Item>
                </Menu>
                <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
                    {this.handleSignScreens()}
                </Row>
            </div>
        )
    }
}