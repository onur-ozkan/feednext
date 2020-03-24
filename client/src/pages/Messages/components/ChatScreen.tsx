import React from 'react'
import { Avatar, List, Input, Card, Button, Form, Divider } from 'antd'

const ChatScreen: React.FC = () => {
	const data = [
		{
			name: 'Onur',
			isReciever: true,
			message:
				'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
			avatar: <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />,
			createdAt: '3:56 PM',
		},
		{
			name: 'Ahmet',
			isReciever: true,
			message:
				'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
			avatar: <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />,
			createdAt: '3:58 PM',
		},
		{
			name: 'Onur',
			isReciever: false,
			message:
				'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
			avatar: <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />,
			createdAt: '4:12 PM',
		},
		{
			name: 'Onur',
			isReciever: true,
			message:
				'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
			avatar: <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />,
			createdAt: '4:12 PM',
		},
		{
			name: 'Ahmet',
			isReciever: false,
			message:
				'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
			avatar: <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />,
			createdAt: '4:15 PM',
		},
	]

	const renderMessages = (item, index) => {
		if (index !== 0 && data[index - 1].createdAt === item.createdAt) {
			return (
				<List.Item.Meta
					style={{ marginTop: -15 }}
					avatar={<Avatar style={{ visibility: 'hidden' }} />}
					description={<span style={{ color: '#333' }}> {item.message} </span>}
				/>
			)
		}

		return (
			<List.Item.Meta
				avatar={item.avatar}
				title={
					<>
						<a href="https://ant.design" style={{ fontWeight: 'bold', color: '#212121' }}>
							{item.name}
						</a>
						<span style={{ color: 'gray', fontSize: 12 }}> {item.createdAt} </span>
					</>
				}
				description={<span style={{ color: '#333' }}> {item.message} </span>}
			/>
		)
	}

	return (
		<>
			<List
				itemLayout="horizontal"
				dataSource={data}
				renderItem={(item, index) => (
					<List.Item style={{ borderBottom: 0 }}>{renderMessages(item, index)}</List.Item>
				)}
			/>
			<Divider dashed style={{ backgroundColor: 'rgba(0,0,0,0.25)' }} />
			<Form>
				<Form.Item style={{ margin: 0 }}>
					<Input.TextArea placeholder="Write a message..." rows={4} />
				</Form.Item>
				<Form.Item style={{ float: 'right' }}>
					<Button htmlType="submit"> Send </Button>
				</Form.Item>
			</Form>
		</>
	)
}

export default ChatScreen
