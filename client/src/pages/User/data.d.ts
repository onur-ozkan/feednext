export declare interface TagType {
	key: string
	label: string
}
export declare interface VisitDataType {
	x: string
	y: number
}

export declare interface SearchDataType {
	index: number
	keyword: string
	count: number
	range: number
	status: number
}

export declare interface OfflineDataType {
	name: string
	cvr: number
}

export declare interface OfflineChartData {
	x: any
	y1: number
	y2: number
}

export declare interface RadarData {
	name: string
	label: string
	value: number
}

export declare interface AnalysisData {
	visitData: VisitDataType[]
	visitData2: VisitDataType[]
	salesData: VisitDataType[]
	searchData: SearchDataType[]
	offlineData: OfflineDataType[]
	offlineChartData: OfflineChartData[]
	salesTypeData: VisitDataType[]
	salesTypeDataOnline: VisitDataType[]
	salesTypeDataOffline: VisitDataType[]
	radarData: RadarData[]
}

export declare interface GeographicType {
	province: {
		label: string
		key: string
	}
	city: {
		label: string
		key: string
	}
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
export declare interface Member {
	avatar: string
	name: string
	id: string
}

export declare interface ActivitiesType {
	id: string
	updatedAt: string
	user: {
		name: string
		avatar: string
	}
	group: {
		name: string
		link: string
	}
	project: {
		name: string
		link: string
	}

	template: string
}

export declare interface RadarDataType {
	label: string
	name: string
	value: number
}
