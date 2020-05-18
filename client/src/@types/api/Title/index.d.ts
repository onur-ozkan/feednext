export interface TitleResponseData {
	type: 'title_detail',
	attributes: {
		id: string,
		name: string,
		slug: string,
		entry_count: number,
		category_id: string,
		category_ancestors: string[],
		opened_by: string,
		rate: {
			username: string,
			rateValue: number
		}[],
		updated_by?: string | undefined,
		created_at: string,
		updated_at: string
	}
}
