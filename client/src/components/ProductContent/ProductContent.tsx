import React from 'react'
import { Comment, Icon, Tooltip, Tabs, Rate, Form, Input, Button } from 'antd'
import moment from 'moment'

import {TagComponent} from '../Tag/Tag'

const { TabPane } = Tabs
const { TextArea } = Input

export class ProductContentComponent extends React.Component {
	state = {
		likes: 0,
		dislikes: 0,
		action: null,
		submitting: false
	}

	like = () => {
		this.setState({
			likes: 1,
			dislikes: 0,
			action: 'liked'
		})
	}
	callback = (key) => {
		console.log(key)
	}

	dislike = () => {
		this.setState({
			likes: 0,
			dislikes: 1,
			action: 'disliked'
		})
	}

	render() {
		const { likes, dislikes, action } = this.state

		const actions = [
			<span key="comment-basic-like">
				<Tooltip title="Like">
					<Icon type="like" theme={action === 'liked' ? 'filled' : 'outlined'} onClick={this.like} />
				</Tooltip>
				<span style={{ paddingLeft: 8, cursor: 'auto' }}>{likes}</span>
			</span>,
			<span key=" key=&quotcomment-basic-dislike&quot">
				<Tooltip title="Dislike">
					<Icon type="dislike" theme={action === 'disliked' ? 'filled' : 'outlined'} onClick={this.dislike} />
				</Tooltip>
				<span style={{ paddingLeft: 8, cursor: 'auto' }}>{dislikes}</span>
			</span>
		]

		return (
			<div style={{ overflow: 'scroll' }}>
				<span style={{ fontSize: '25px', color: '#212121' }}> Example Title </span>
				<TagComponent color="red" name="Example Tag"/>
				<br />
				<Rate allowHalf defaultValue={2.5} />
				<br />
				<br />
				<Tabs defaultActiveKey="1" onChange={this.callback}>
					<TabPane tab="English" key="1">
						<Comment
							actions={actions}
							author={<a>Han Solo</a>}
							content={
								<p>
									We supply a series of design principles, practical patterns and high quality design
									resources (Sketch and Axure), to help people create their product prototypes
									beautifully and efficiently.
								</p>
							}
							datetime={
								<Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
									<span>{moment().fromNow()}</span>
								</Tooltip>
							}
						/>
						<Comment
							actions={actions}
							author={<a>Han Solo</a>}
							content={
								<p>
									We supply a series of design principles, practical patterns and high quality design
									resources (Sketch and Axure), to help people create their product prototypes
									beautifully and efficiently.
								</p>
							}
							datetime={
								<Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
									<span>{moment().fromNow()}</span>
								</Tooltip>
							}
						/>
						<Comment
							actions={actions}
							author={<a>Han Solo</a>}
							content={
								<p>
									We supply a series of design principles, practical patterns and high quality design
									resources (Sketch and Axure), to help people create their product prototypes
									beautifully and efficiently.
								</p>
							}
							datetime={
								<Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
									<span>{moment().fromNow()}</span>
								</Tooltip>
							}
						/>
						<Comment
							actions={actions}
							author={<a>Han Solo</a>}
							content={
								<p>
									We supply a series of design principles, practical patterns and high quality design
									resources (Sketch and Axure), to help people create their product prototypes
									beautifully and efficiently.
								</p>
							}
							datetime={
								<Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
									<span>{moment().fromNow()}</span>
								</Tooltip>
							}
						/>
						<div>
							<Form.Item>
								<TextArea
									style={{ resize: 'none', width: 1250 }}
									placeholder="Autosize height with minimum and maximum number of lines"
									autoSize={{ minRows: 2, maxRows: 6 }}
								/>
							</Form.Item>
							<Form.Item>
								<Button
									htmlType="submit"
									loading={this.state.submitting}
									onClick={() => console.log('asd')}
									type="primary"
								>
									Add Comment
								</Button>
							</Form.Item>
						</div>
					</TabPane>
					<TabPane tab="Turkish" key="2">
						Content of Tab Pane 2
					</TabPane>
					<TabPane tab="Mixed" key="3">
						Content of Tab Pane 3
					</TabPane>
				</Tabs>
			</div>
		)
	}
}
