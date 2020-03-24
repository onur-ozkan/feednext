export declare interface TagType {
	key: string
	label: string
}

export declare interface GeographicItemType {
	name: string
	id: string
}

export declare interface GeographicType {
	province: GeographicItemType
	city: GeographicItemType
}

export declare interface NoticeType {
	id: string
	title: string
	logo: string
	description: string
	updatedAt: string
	member: string
	href: string
	memberLink: string
}

export declare interface CurrentUser {
	name: string
	avatar: string
	userid: string
	notice: NoticeType[]
	email: string
	signature: string
	title: string
	group: string
	tags: TagType[]
	notifyCount: number
	unreadCount: number
	country: string
	geographic: GeographicType
	address: string
	phone: string
}
