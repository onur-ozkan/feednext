import React, { useEffect, Dispatch, SetStateAction, useState } from 'react'
import Link from 'next/link'
import { Menu, Icon } from 'antd'

export const NavbarComponent: React.FunctionComponent = (props) => {
    const [currentPath, setCurrentPath]: [string, Dispatch<SetStateAction<string>>] = useState(null)
    useEffect(() => {
        setCurrentPath(window.location.pathname)
    }, [])
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
            <Menu.Item style={{ float: 'right' }} key="3">
                { false ?
                    <Link href="/sign">
                        <a>
                            <Icon style={{ fontSize: '15px' }} type="user" />
                            SIGN
                        </a>
                    </Link>
                    :
                    <Link href="/profile">
                        <a>
                            <Icon style={{ fontSize: '15px' }} type="user" />
                            Profile
                        </a>
                    </Link>
                }
            </Menu.Item>
        </Menu>
    )
}
