export interface TagResponseData {
	type: 'tag_detail',
	attributes: {
		_id: string,
		name: string,
		total_title: number,
		popularity_ratio: number,
		created_at: string,
		updated_at: string
	}
}

export interface TrendingTagsResponseData {
	_id: string,
	name: string,
	total_title: number,
	popularity_ratio: number,
	created_at: string,
	updated_at: string
}

