// Antd dependencies
import { Card, Row, Col, Avatar, Typography, Divider, Tooltip } from 'antd'
import { SettingOutlined, IdcardOutlined, UpSquareOutlined, LinkOutlined, SolutionOutlined, MessageOutlined } from '@ant-design/icons'
import { GridContent } from '@ant-design/pro-layout'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { format, parseISO } from 'date-fns'
import { history } from 'umi'

// Local files
import { fetchUserByUsername } from '@/services/api'
import { API_URL } from '../../../config/constants'
import { PageHelmet } from '@/components/PageHelmet'
import PageLoading from '@/components/PageLoading'
import NotFoundPage from '../404'
import { UserTabs } from './components/UserTabs'

const User: React.FC = ({ match }): JSX.Element => {
	const userState = useSelector((state: any) => state.user?.attributes.user)

	const [user, setUser] = useState(userState)
	const [isUserFound, setIsUserFound] = useState<boolean | null>(null)

	const readableRoles = {
		0: 'User',
		1: 'Junior Author',
		2: 'Mid Level Author',
		3: 'Senior Author',
		4: 'Admin',
		5: 'Super Admin',
	}

	useEffect(() => {
		if (!user || user.name !== match.params.username) {
			fetchUserByUsername(match.params.username)
				.then(res => {
					setUser(res.data.attributes)
					setIsUserFound(true)
				})
				.catch(error => setIsUserFound(false))
			return
		}
		setIsUserFound(true)
	}, [])

	if (isUserFound === null) return <PageLoading />
	if (isUserFound === false) return <NotFoundPage />

	return (
		<>
			<PageHelmet
				title={`${user.full_name} | Feednext`}
				description="Best reviews, comments, feedbacks about anything around the world"
				keywords={`${user.full_name}, ${user.username}, user, profile, account`}
				mediaTitle={user.username}
				mediaImage={`${API_URL}/v1/user/pp?username=${user.username}`}
				mediaDescription={`${user.full_name}'s profile page on Feednext`}
			/>
			<GridContent>
				<Row gutter={24}>
					<Col lg={10} md={24}>
						<Card bordered={false}>
							<div style={{ textAlign: 'right', margin: '-4px 0px 5px 0px'}}>
								{userState && (userState.username === match.params.username) &&
									<SettingOutlined
										onClick={(): void => history.push('/settings')}
										style={{ fontSize: 18, cursor: 'pointer', color: '#ff2d20' }}
									/>
								}
								{userState && (userState.username !== match.params.username) &&
									<MessageOutlined
										onClick={(): void => history.push('/messages/compose', { defaultUsername: user.username })}
										style={{ fontSize: 18, cursor: 'pointer', color: '#ff2d20' }}
									/>
								}
							</div>
							<div style={{ textAlign: 'center' }}>
								<Avatar
									style={{ marginBottom: 10 }}
									size={115}
									src={`${API_URL}/v1/user/pp?username=${match.params.username}`}
								/>
								<Typography.Title level={3}> {user.full_name} </Typography.Title>
							</div>

							<Row style={{ padding: 20 }}>
								<Col span={24} style={{ fontSize: 16 }}>
									<Tooltip placement="bottom" title="Username">
										<Typography.Text>
											<IdcardOutlined style={{ marginRight: 3, color: '#ff2d20' }} /> {user.username}
										</Typography.Text>
									</Tooltip>
								</Col>
								<Col span={24} style={{ fontSize: 16 }}>
									<Tooltip placement="bottom" title="Role">
										<Typography.Text>
											<UpSquareOutlined style={{ marginRight: 3, color: '#ff2d20' }} /> {readableRoles[user.role]}
										</Typography.Text>
									</Tooltip>
								</Col>
								<Col span={24} style={{ fontSize: 16 }}>
									<Tooltip placement="bottom" title="Link">
										<LinkOutlined style={{ marginRight: 3, color: '#ff2d20' }} />
										{user.link ?
											(
												<a
													href={
														new RegExp('^(https?|ftp)://').test(user.link) ? user.link : `https://${user.link}`
													}
													target={`_${user.username}`}
												>
													{user.link}
												</a> )
											:
											( <Typography.Text> - </Typography.Text> )
										}
									</Tooltip>
								</Col>
							</Row>
							<Divider>
								<Typography.Text code>
									<SolutionOutlined style={{ marginRight: 3 }} /> Biography
								</Typography.Text>
							</Divider>
							<Col span={24} style={{ fontSize: 16 }}>
								{user.biography ?
									(<Typography.Text> {user.biography} </Typography.Text>)
									:
									(<Typography.Text> - </Typography.Text>)
								}
							</Col>
							<Divider style={{ marginBottom: 0 }} orientation="right">
								<Typography.Text style={{ fontSize: 13 }}>
									Joined at {format(parseISO(user.created_at), 'dd LLL yyyy (p O)')}
								</Typography.Text>
							</Divider>
						</Card>
					</Col>
					<Col lg={14} md={24}>
						<UserTabs username={match.params.username} />
					</Col>
				</Row>
				<br/>
			</GridContent>
		</>
	)
}

export default User
