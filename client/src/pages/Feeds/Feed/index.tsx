import React from 'react'
import FeedHeader from './components/FeedHeader'
import FeedEntries from './components/FeedEntries'

const Feed: React.FC = () => {
	return (
		<>
			<FeedHeader />
			<FeedEntries />
		</>
	)
}

export default Feed
