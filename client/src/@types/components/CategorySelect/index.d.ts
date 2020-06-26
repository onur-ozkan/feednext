export interface CategoryData {
	id: string
	name: string
	is_leaf: boolean
	ancestors: string[]
	created_at: string
	updated_at: string
}

export interface CategorySelectProps {
	style?: { [key: string]: string | number }
	placeHolder?: string
	multiple?: boolean
	allowClear?: boolean
	defaultValue?: string
	onSelect: (id: string | string[], title: React.ReactNode[]) => any
}
