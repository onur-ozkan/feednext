import React from 'react'
import MessageTabs from './components/MessageTabs'
import styles from './style.less'

const Messages = (params: any): JSX.Element => {
	return (
		<div className={styles.globalClass}>
			<MessageTabs tabKey={params.location.state?.key}/>
			<br/>
		</div>
	)
}

export default Messages
