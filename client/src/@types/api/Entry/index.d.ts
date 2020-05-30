export interface EntryResponseData {
	type: 'entry_detail',
	attributes: {
		id: string,
		text: string,
		title_id: string,
		written_by: string,
		votes: {
			up_voted: string[],
			down_voted: string[],
			value: number
		},
		created_at: string,
		updated_at: string
	}
}
