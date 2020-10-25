// Antd dependencies
import { Card, Row, Col, Avatar, Typography, Divider, Tooltip } from 'antd'
import { SettingOutlined, IdcardOutlined, UpSquareOutlined, LinkOutlined, SolutionOutlined, MessageOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { NextPage } from 'next'
import { useRouter, NextRouter } from 'next/router'
import { format, parseISO } from 'date-fns'


// Local files
import { API_URL } from '@/../config/constants'
import { PageHelmet } from '@/components/global/PageHelmet'
import { UserTabs } from '@/components/pages/user/[username]'
import { getUserPageInitialValues } from '@/services/initializations'
import { UserPageInitials } from '@/@types/initializations'
import { AppLayout } from '@/layouts/AppLayout'
import { Roles } from '@/enums'
import NotFoundPage from '@/pages/404'

const readableRoles = {
	0: 'User',
	1: 'Junior Author',
	2: 'Mid Level Author',
	3: 'Senior Author',
	4: 'Admin',
	5: 'Super Admin',
}

const User: NextPage<UserPageInitials> = (props): JSX.Element => {
	const router: NextRouter & { query: { username?: string } } = useRouter()
	const userState = useSelector((state: any) => state.user?.attributes.user)
	const [user, setUser] = useState(props.user)

	if (!user) return <NotFoundPage />

	return (
		<AppLayout authority={Roles.Guest}>
			<PageHelmet
				title={`${user.attributes.full_name} | Feednext`}
				description="Best reviews, comments, feedbacks about anything around the world"
				keywords={`${user.attributes.full_name}, ${user.attributes.username}, user, profile, account`}
				mediaTitle={user.attributes.username}
				mediaImage={`${API_URL}/v1/user/pp?username=${user.attributes.username}`}
				mediaDescription={`${user.attributes.full_name}'s profile page on Feednext`}
			/>
			<Row gutter={[5, 10]} style={{ padding: 5 }}>
				<Col lg={10} md={24} sm={24} xs={24}>
					<Card style={{ borderRadius: 5 }}>
						<div style={{ textAlign: 'right', margin: '-4px 0 5px 0' }}>
							{userState && (userState.username === router.query.username) &&
								<SettingOutlined
									onClick={() => router.push('/settings')}
									style={{ fontSize: 18, cursor: 'pointer', color: '#6ec49a' }}
								/>
							}
							{userState && (userState.username !== router.query.username) &&
								<MessageOutlined
									onClick={() => router.push(`/messages/compose?username=${user.attributes.username}`)}
									style={{ fontSize: 18, cursor: 'pointer', color: '#6ec49a' }}
								/>
							}
						</div>
						<div style={{ textAlign: 'center' }}>
							<Avatar
								style={{ marginBottom: 10 }}
								size={115}
								src={`${API_URL}/v1/user/pp?username=${router.query.username}`}
								alt="User Image"
							/>
							<Typography.Title level={3}> {user.attributes.full_name} </Typography.Title>
						</div>

						<Row style={{ padding: 20 }}>
							<Col span={24} style={{ fontSize: 16 }}>
								<Tooltip placement="bottom" title="Username">
									<Typography.Text>
										<IdcardOutlined style={{ marginRight: 3, color: '#6ec49a' }} /> {user.attributes.username}
									</Typography.Text>
								</Tooltip>
							</Col>
							<Col span={24} style={{ fontSize: 16 }}>
								<Tooltip placement="bottom" title="Role">
									<Typography.Text>
										<UpSquareOutlined style={{ marginRight: 3, color: '#6ec49a' }} /> {readableRoles[user.attributes.role]}
									</Typography.Text>
								</Tooltip>
							</Col>
							<Col span={24} style={{ fontSize: 16 }}>
								<Tooltip placement="bottom" title="Link">
									<>
										<LinkOutlined style={{ marginRight: 3, color: '#6ec49a' }} />
										{user.attributes.link ?
											(
												<a
													href={
														new RegExp('^(https?|ftp)://').test(user.attributes.link) ? user.attributes.link : `https://${user.attributes.link}`
													}
													target={`_${user.attributes.username}`}
												>
													{user.attributes.link}
												</a>)
											:
											(<Typography.Text> - </Typography.Text>)
										}
									</>
								</Tooltip>
							</Col>
						</Row>
						<Divider>
							<Typography.Text code>
								<SolutionOutlined style={{ marginRight: 3 }} /> Biography
								</Typography.Text>
						</Divider>
						<Col span={24} style={{ fontSize: 16 }}>
							{user.attributes.biography ?
								(<Typography.Text> {user.attributes.biography} </Typography.Text>)
								:
								(<Typography.Text> - </Typography.Text>)
							}
						</Col>
						<Divider style={{ marginBottom: 0 }} orientation="right">
							<Typography.Text style={{ fontSize: 13 }}>
								Joined at {format(parseISO(user.attributes.created_at), 'dd LLL yyyy (p O)')}
							</Typography.Text>
						</Divider>
					</Card>
				</Col>
				<Col lg={14} md={24} sm={24}>
					<UserTabs username={router.query.username} />
				</Col>
			</Row>
			<br />
		</AppLayout>
	)
}

User.getInitialProps = async (context: any) => await getUserPageInitialValues(context.query.username)

export default User
