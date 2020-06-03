// Antd dependencies
import { Typography } from "antd"

// Other dependencies
import React from 'react'

// Local files
import conversationImg from '@/assets/conversation.png'

export const WelcomePage = (): JSX.Element => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: 700
			}}
		>
			<img style={{ opacity: 0.65 }} src={conversationImg} width="150" alt="Conversation Png" />
			<Typography.Paragraph style={{ textAlign: 'center', width: 275 }}>
				Direct Messages are end to end ecrypted conversations
				between you and other people on Feednext
			</Typography.Paragraph>
		</div>
	)
}
