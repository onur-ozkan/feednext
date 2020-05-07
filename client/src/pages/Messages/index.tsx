import React, { useEffect, useState } from 'react'
import { Card } from 'antd'
import { useSelector } from 'react-redux'


const Messages = ({ computedMatch }): JSX.Element => {
	const globalState = useSelector((state: any) => state.global)

	useEffect(() => {
		globalState.socketConnection?.emit('sendMessage', 'heyyy')
	}, [])
	return (
		<>
			<Card>

			</Card>
		</>
	)
}

export default Messages
