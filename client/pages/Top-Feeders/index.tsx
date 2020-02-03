// Global dependencies
import * as React from 'react'
import { Tabs, Table } from 'antd'

// Local files
import { LayoutComponent } from '../../src/components/Layout/Layout'

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: 150
    },
    {
        title: 'Age',
        dataIndex: 'age',
        width: 150
    },
    {
        title: 'Address',
        dataIndex: 'address'
    }
]

const data = []
for (let i = 0; i < 100; i++) {
    data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
    })
}

export default props => (
    <LayoutComponent>
        <span style={{ fontSize: '25px', color: '#212121' }}> Top Feeders </span>
        <br />
        <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Global" key="1">
                <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 750 }} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="By Country" key="2">
                Content of Tab Pane 2
			</Tabs.TabPane>
        </Tabs>
    </LayoutComponent>
)
