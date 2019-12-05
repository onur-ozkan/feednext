import React from 'react'
import Link from 'next/link'
import { Menu} from 'antd'

export const Nav: React.FunctionComponent = (props) =>
    <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ lineHeight: '55px', textAlign: 'center' }}
    >
        <Menu.Item key="1">
            <Link href="/">
                <a>Home</a>
            </Link>
        </Menu.Item>
        <Menu.Item key="2">
            <Link href="/#">
                <a>Page 2</a>
            </Link>
        </Menu.Item>
        <Menu.Item key="3">
            <Link href="/#">
                <a>Page 3</a>
            </Link>
        </Menu.Item>
    </Menu>