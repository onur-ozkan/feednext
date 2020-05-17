export interface FeedList {
	id: string,
	name: string,
	slug: string,
	href: string,
	categoryName: string,
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
