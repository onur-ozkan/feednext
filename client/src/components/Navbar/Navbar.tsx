import React, { useEffect, Dispatch, SetStateAction, useState } from 'react'
import Link from 'next/link'
import { Menu, Icon } from 'antd'

export const NavbarComponent: React.FunctionComponent = (props: any) => {
    const [currentPath, setCurrentPath]: [string, Dispatch<SetStateAction<string>>] = useState(null)
    useEffect(() => {
        setCurrentPath(window.location.pathname)
    }, [])

    const handleIsUserLoggedIn = (isLoggedIn: boolean): React.ReactElement => {
        return (
            <Menu.Item style={{ float: 'right' }} key={isLoggedIn ? '/profile' : '/sign'}>
                <Link href={isLoggedIn ? '/profile' : '/sign'} >
                    <a>
                        <Icon style={{ fontSize: '15px' }} type="user" />
                        {isLoggedIn ? 'Profile' : 'SIGN'}
                    </a>
                </Link>
            </Menu.Item>
        )
    }
    return (
        <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[currentPath]}
            style={{ textAlign: 'left', width: '100%', border: 0, padding: '5px' }}
        >
            <Menu.Item key="/">
                <Link href="/">
                    <a>Titles</a>
                </Link>
            </Menu.Item>
            <Menu.Item key="/top-feeders">
                <Link href="/top-feeders">
                    <a>Top Feeders</a>
                </Link>
            </Menu.Item>
            {handleIsUserLoggedIn(true)}
        </Menu>
    )
}
