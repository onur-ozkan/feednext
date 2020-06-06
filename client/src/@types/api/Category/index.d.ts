export interface CategoryResponseData {
	type: 'category_detail',
	attributes: {
		id: string,
		name: string,
		is_leaf: boolean,
		parent_category: string,
		ancestors: string[],
		created_at: string,
		updated_at: string
	}
}

export interface TrendingCategoriesResponseData {
	id: string,
	name: string,
	is_leaf: boolean,
	parent_category: string,
	ancestors: string[],
	created_at: string,
	updated_at: string
}

