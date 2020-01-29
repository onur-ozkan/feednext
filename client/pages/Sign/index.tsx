// Global dependencies
import React, { useState } from 'react'
import Link from 'next/link'
import { Icon, Row, Menu } from 'antd'

// Local files
import SignInComponent from '../../src/components/Signin/Signin'
import SignUpComponent from '../../src/components/Signup/Signup'


// export default class Sign extends React.Component<{}, IComponentState> 
const Sign = props => {
    const [isSignIn, setIsSignIn] = useState(true)

    const handleSignScreens = () => {
        if (isSignIn) {
            return <SignInComponent />
        }
        return <SignUpComponent />
    }

    return (
        <div>
            <Menu
                defaultSelectedKeys={['signin']}
                style={{ display: 'flex', justifyContent: 'center', padding: '5px', border: 0 }}
                mode="horizontal"
            >
                <Menu.Item key="exit">
                    <Link href="/">
                        <a>
                            <Icon type="left-circle" />
                            Back to App
                        </a>
                    </Link>
                </Menu.Item>
                <hr />
                <Menu.Item onClick={() => setIsSignIn(false)} key="signup">
                    <Icon type="user-add" />
                    Sign Up
                </Menu.Item>
                <Menu.Item onClick={() => setIsSignIn(true)} key="signin">
                    <Icon type="login" />
                    Sign In
                </Menu.Item>
            </Menu>
            <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
                {handleSignScreens()}
            </Row>
        </div>
    )
}

export default Sign
