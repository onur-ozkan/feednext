// Antd dependencies
import { Modal, Typography, Divider } from 'antd'

// Other dependencies
import React from 'react'

// Local files
import { LoginForm } from './components/LoginForm'
import { ComponentProps } from './types'
import './style.less'

export const SignModal = (props: ComponentProps) => (
	<Modal
		transitionName="fade"
		className="signModal"
		style={{ top: 35, maxWidth: 400 }}
		centered
		visible={props.visibility}
		closable={false}
		footer={null}
		onCancel={props.closeModal}
	>
		<Divider style={{ margin: "-10px 0px 10px 0px" }} orientation="center">
			<Typography.Title level={4}>Sign In</Typography.Title>
		</Divider>
		<Typography.Text strong>This action requires User sign, please sign in before doing that</Typography.Text>
		<LoginForm />
	</Modal>
)
