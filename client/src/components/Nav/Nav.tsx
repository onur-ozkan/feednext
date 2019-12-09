import React from 'react'
import Link from 'next/link'
import { Menu, Icon } from 'antd'

export const Nav: React.FunctionComponent = (props) =>
    <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ textAlign: 'left' }}
    >
        <Menu.Item key="1">
            <Link href="/">
                <a>Top Titles</a>
            </Link>
        </Menu.Item>
        <Menu.Item key="2">
            <Link href="/">
                <a>Top Feeders</a>
            </Link>
        </Menu.Item>
        <Menu.Item style={{float: 'right'}} key="7">
            <Link href="/sign">
                <a>
                    <Icon style={{ fontSize: '15px' }} type="user" />
                    SIGN
                </a>
            </Link>
        </Menu.Item>
    </Menu>