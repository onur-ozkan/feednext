export interface FeedList {
	id: string,
	name: string,
	slug: string,
	href: string,
	tags: string[],
	entryCount: number,
	featuredEntry: {
		id: string,
		text: string,
		avatar: string,
		voteValue: number,
		writtenBy: string
		createdAt: string,
		updatedAt: string,
	},
	createdAt: string,
	updatedAt: string
}

export interface FlowHeaderProps {
	sortBy: "top" | "hot" | undefined,
	setSortBy: (val: "top" | "hot" | undefined) => void,
	resetTagFilter: () => void,
	beforeFilterReset: () => void
}
